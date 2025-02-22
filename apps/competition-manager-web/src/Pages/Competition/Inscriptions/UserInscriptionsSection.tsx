/**
 * Component for displaying and managing user's inscriptions in a competition
 */

import { Box, Typography } from '@mui/material';
import { useAtomValue, useSetAtom } from 'jotai';
import { useTranslation } from 'react-i18next';
import { inscriptionDataAtom, userInscriptionsAtom } from '../../../GlobalsStates';
import { useMemo } from 'react';
import { AthleteWithoutClub, Eid, Inscription } from '@competition-manager/schemas';
import { useNavigate } from 'react-router-dom';
import { useCompetition } from '../../../hooks/useCompetition';
import { InscriptionAccordion } from './InscriptionAccordion';

/**
 * Groups inscriptions by athlete for better organization
 * @param inscriptions List of inscriptions to group
 * @returns Record with athlete ID as key and their inscriptions as value
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
    competitionEid: string;
    competitionDate: Date;
}

/**
 * Section component that displays all inscriptions for the current user
 * Allows editing and deleting inscriptions if the competition is in the future
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

    // Group inscriptions by athlete for better organization
    const groupedInscriptions = useMemo(() => 
        groupInscriptionsByAthlete(userInscriptions || []),
        [userInscriptions]
    );

    const handleDelete = async (athlete: AthleteWithoutClub, inscriptions: Inscription[]) => {
        //TODO: Implement delete functionality for all athlete's inscriptions
        console.log('Delete inscriptions for athlete:', athlete.id, inscriptions.map(i => i.eid));
    };

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

    if (!userInscriptions?.length) {
        return null;
    }

    return (
        <Box sx={{ mb: 3 }}>
            <Typography variant="h6" sx={{ mb: 2 }}>
                {t('competition:myInscriptions')} ({userInscriptions.length})
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