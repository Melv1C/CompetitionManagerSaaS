/**
 * File: apps/competition-manager-web/src/Pages/Competition/Inscriptions/UserInscriptionsSection.tsx
 * 
 * This component displays and manages a user's inscriptions for a specific competition.
 * It provides functionality to view, edit, and delete inscriptions, with special handling
 * for paid inscriptions and refund policies.
 * 
 * Features:
 * - Groups inscriptions by athlete for better organization
 * - Supports editing existing inscriptions
 * - Handles deletion with confirmation dialog
 * - Special warning for paid inscriptions regarding refund policy
 * - Supports i18n with plural forms for messages
 */

import { Box, Typography, Alert, DialogContentText } from '@mui/material';
import { useAtomValue, useSetAtom } from 'jotai';
import { useTranslation } from 'react-i18next';
import { inscriptionDataAtom, userInscriptionsAtom } from '../../../GlobalsStates';
import { useMemo } from 'react';
import { AthleteWithoutClub, Eid, Inscription } from '@competition-manager/schemas';
import { useNavigate } from 'react-router-dom';
import { useCompetition } from '../../../hooks/useCompetition';
import { InscriptionAccordion } from './InscriptionAccordion';
import { useConfirmDialog } from '../../../Components/ConfirmDialog';
import { useMutation, useQueryClient } from 'react-query';
import { deleteInscriptions } from '../../../api/Inscription';
import { useSnackbar } from '../../../hooks/useSnackbar';

/**
 * Groups inscriptions by athlete for better organization and display
 * 
 * @param inscriptions - List of inscriptions to group
 * @returns Record with athlete ID as key and their inscriptions as value
 * 
 * Example:
 * ```typescript
 * {
 *   "athlete-123": {
 *     athlete: { id: "123", firstName: "John", lastName: "Doe" },
 *     inscriptions: [inscription1, inscription2]
 *   }
 * }
 * ```
 */
const groupInscriptionsByAthlete = (inscriptions: Inscription[]) => {
    return inscriptions.reduce((acc, inscription) => {
        const athleteId = inscription.athlete.id;
        if (!acc[athleteId]) {
            acc[athleteId] = {
                athlete: inscription.athlete,
                inscriptions: []
            };
        }
        acc[athleteId].inscriptions.push(inscription);
        return acc;
    }, {} as Record<Eid, { athlete: AthleteWithoutClub, inscriptions: Inscription[] }>);
};

interface UserInscriptionsSectionProps {
    /** External ID of the competition */
    competitionEid: string;
    /** Date of the competition, used to determine if editing is allowed */
    competitionDate: Date;
}

/**
 * Section component that displays all inscriptions for the current user.
 * Allows editing and deleting inscriptions if the competition is in the future.
 * 
 * Features:
 * - Groups inscriptions by athlete
 * - Shows total inscription count
 * - Handles deletion with confirmation and refund policy warning
 * - Supports editing existing inscriptions
 * - Automatically refreshes data after changes
 * 
 * @param competitionEid - External ID of the competition
 * @param competitionDate - Date of the competition
 */
export const UserInscriptionsSection: React.FC<UserInscriptionsSectionProps> = ({ 
    competitionEid,
    competitionDate 
}) => {
    const { t } = useTranslation();
    const navigate = useNavigate();
    const userInscriptions = useAtomValue(userInscriptionsAtom);
    const setInscriptionData = useSetAtom(inscriptionDataAtom);
    const { isFuture } = useCompetition();
    const { confirm } = useConfirmDialog();
    const { showSnackbar } = useSnackbar();
    const queryClient = useQueryClient();

    // Filter out deleted inscriptions
    const notDeletedInscriptions =
        userInscriptions?.filter((i) => !i.isDeleted) || [];

    // Group inscriptions by athlete for better organization
    const groupedInscriptions = useMemo(
        () => groupInscriptionsByAthlete(notDeletedInscriptions || []),
        [userInscriptions]
    );

    /**
     * Mutation for deleting inscriptions.
     * Handles cache invalidation and success/error notifications.
     */
    const deleteMutation = useMutation(
        async ({ inscriptionEid }: { inscriptionEid: Eid }) => {
            return deleteInscriptions(competitionEid, inscriptionEid);
        },
        {
            onSuccess: () => {
                // Invalidate and refetch all related queries to ensure UI consistency
                queryClient.invalidateQueries(['inscriptions', competitionEid]);
                queryClient.invalidateQueries(['userInscriptions', competitionEid]);
                queryClient.invalidateQueries(['adminInscriptions', competitionEid]);
                showSnackbar(t('competition:inscriptionDeletedSuccess'), 'success');
            },
            onError: () => {
                showSnackbar(t('errors:inscriptionDeleteFailed'), 'error');
            }
        }
    );

    /**
     * Handles the deletion of inscriptions for an athlete.
     * Shows a confirmation dialog with refund policy warning if any inscriptions are paid.
     * 
     * @param athlete - The athlete whose inscriptions are being deleted
     * @param inscriptions - List of inscriptions to delete
     */
    const handleDelete = async (athlete: AthleteWithoutClub, inscriptions: Inscription[]) => {
        const hasPaidInscriptions = inscriptions.some(i => i.paid);
        
        const confirmed = await confirm({
            title: t('competition:confirmDeleteInscription', { count: inscriptions.length }),
            message: (
                <DialogContentText>
                    {t('competition:confirmDeleteInscriptionMessage', { 
                        athlete: `${athlete.firstName} ${athlete.lastName}`,
                        count: inscriptions.length
                    })}
                </DialogContentText>
            ),
            additionalContent: hasPaidInscriptions ? (
                <Alert severity="warning" sx={{ mt: 2 }}>
                    {t('competition:refundPolicyWarning')}
                </Alert>
            ) : undefined
        });

        if (confirmed) {
            // Delete each inscription sequentially
            for (const inscription of inscriptions) {
                await deleteMutation.mutateAsync({ inscriptionEid: inscription.eid });
            }
        }
    };

    /**
     * Handles editing inscriptions for an athlete.
     * Sets up the inscription data and navigates to the registration page.
     * 
     * @param athlete - The athlete whose inscriptions are being edited
     * @param inscriptions - List of inscriptions to edit
     */
    const handleEdit = (athlete: AthleteWithoutClub, inscriptions: Inscription[]) => {
        // Set inscription data and navigate to registration
        setInscriptionData({
            athlete: { ...athlete, club: inscriptions[0].club },
            inscriptionsData: inscriptions.map(i => ({
                eid: i.eid,
                competitionEvent: i.competitionEvent,
                record: i.record,
                paid: i.paid
            }))
        });
        navigate(`/competitions/${competitionEid}/register`);
    };

    // Don't render anything if there are no inscriptions
    if (!notDeletedInscriptions?.length) {
        return null;
    }

    return (
        <Box sx={{ mb: 3 }}>
            <Typography variant="h6" sx={{ mb: 2 }}>
                {t('competition:myInscriptions')} (
                {notDeletedInscriptions.length})
            </Typography>
            
            {Object.entries(groupedInscriptions).map(([athleteId, group]) => (
                <InscriptionAccordion
                    key={athleteId}
                    athlete={group.athlete}
                    inscriptions={group.inscriptions}
                    competitionEid={competitionEid}
                    competitionDate={competitionDate}
                    onEdit={handleEdit}
                    onDelete={handleDelete}
                    showActions={isFuture}
                />
            ))}
        </Box>
    );
}; 