import { upsertResults } from '@/api';
import { adminInscriptionsAtom, competitionAtom } from '@/GlobalsStates';
import {
    Athlete as AthleteType,
    Bib as BibType,
    CompetitionEvent,
    Id,
    InscriptionStatus,
    License,
    Result,
    UpsertResult$,
    UpsertResultType,
} from '@competition-manager/schemas';
import { sortPerf } from '@competition-manager/utils';
import {
    closestCenter,
    DndContext,
    DragEndEvent,
    PointerSensor,
    useSensor,
    useSensors,
} from '@dnd-kit/core';
import {
    arrayMove,
    SortableContext,
    verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import { faUserPlus } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
    Box,
    Button,
    Card,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    Divider,
    List,
    ListItem,
    ListItemText,
    Typography,
} from '@mui/material';
import { useAtomValue } from 'jotai';
import { useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useMutation, useQueryClient } from 'react-query';
import { SearchAthleteModal } from './SearchAthleteModal';
import { SortableParticipantItem } from './SortableParticipantItem';

// Simplified Participant type with only required properties
type Participant = {
    license: License; // Athlete license (used as unique ID)
    bib: BibType; // Athlete bib number
    athlete: AthleteType; // Full athlete data
    inscriptionId?: Id; // Optional inscription ID
    isSelected: boolean; // Whether this participant is selected
    resultId?: Id; // ID of existing result (if already in the results)
};

interface ManageParticipantsModalProps {
    open: boolean;
    onClose: () => void;
    event: CompetitionEvent;
    existingResults: Result[];
    onParticipantsUpdated?: () => void;
}

export const ManageParticipantsModal: React.FC<
    ManageParticipantsModalProps
> = ({ open, onClose, event, existingResults, onParticipantsUpdated }) => {
    const { t } = useTranslation();
    const queryClient = useQueryClient();
    const competition = useAtomValue(competitionAtom);
    if (!competition) throw new Error('No competition data found');

    const adminInscriptions = useAtomValue(adminInscriptionsAtom);
    if (!adminInscriptions) throw new Error('No inscriptions found');

    // State for ordered participants (both inscriptions and external athletes)
    const [orderedParticipants, setOrderedParticipants] = useState<
        Participant[]
    >([]);

    // State for search modal
    const [searchModalOpen, setSearchModalOpen] = useState(false);

    // Configure sensors for drag and drop
    const sensors = useSensors(
        useSensor(PointerSensor, {
            activationConstraint: {
                distance: 10,
            },
        })
    );

    // Filter inscriptions for the current event and with status ACCEPTED or CONFIRMED
    const inscriptions = useMemo(() => {
        const filtered = adminInscriptions.filter(
            (inscription) =>
                inscription.competitionEvent.id === event.id &&
                (inscription.status === InscriptionStatus.ACCEPTED ||
                    inscription.status === InscriptionStatus.CONFIRMED)
        );

        // Sort by performance record if available
        return filtered.sort(
            (a, b) =>
                -1 *
                sortPerf(
                    a.record?.perf ?? 0,
                    b.record?.perf ?? 0,
                    a.competitionEvent.event.type
                )
        );
    }, [adminInscriptions, event.id]);

    // Initialize orderedParticipants from existing results and inscriptions
    useEffect(() => {
        if (open) {
            // Start with existing results
            const resultParticipants = existingResults.map((result) => ({
                license: result.athlete.license,
                bib: result.bib,
                athlete: { ...result.athlete, club: result.club },
                inscriptionId: result.inscriptionId || undefined,
                isSelected: true,
                resultId: result.id,
            }));

            // Add inscriptions that aren't in results yet
            const additionalInscriptions = inscriptions
                .filter(
                    (inscription) =>
                        !resultParticipants.some(
                            (p) => p.license === inscription.athlete.license
                        )
                )
                .map((inscription) => ({
                    license: inscription.athlete.license,
                    bib: inscription.athlete.bib,
                    athlete: { ...inscription.athlete, club: inscription.club },
                    inscriptionId: inscription.id,
                    isSelected: false,
                }));

            // Combine and set
            setOrderedParticipants([
                ...resultParticipants,
                ...additionalInscriptions,
            ]);
        }
    }, [open, existingResults, inscriptions]);

    // Handle drag end - reorder participants
    const handleDragEnd = (event: DragEndEvent) => {
        const { active, over } = event;
        if (over && active.id !== over.id) {
            setOrderedParticipants((items) => {
                const oldIndex = items.findIndex(
                    (item) => item.license === active.id
                );
                const newIndex = items.findIndex(
                    (item) => item.license === over.id
                );
                return arrayMove(items, oldIndex, newIndex);
            });
        }
    };

    // Toggle selection for a participant
    const toggleSelection = (license: License) => {
        setOrderedParticipants((prev) =>
            prev.map((p) => {
                // Only allow toggling if participant doesn't have results yet
                if (p.license === license && !p.resultId) {
                    return { ...p, isSelected: !p.isSelected };
                }
                return p;
            })
        );
    };

    // Update results based on participants
    const updateResultsMutation = useMutation({
        mutationFn: async () => {
            // Get selected participants
            const selectedParticipants = orderedParticipants.filter(
                (p) => p.isSelected
            );

            // Create upsert data for results
            const resultsToUpsert = selectedParticipants.map(
                (participant, index) => {
                    // If participant has a resultId, it's an update
                    if (participant.resultId) {
                        // Find existing result to preserve details
                        const existingResult = existingResults.find(
                            (r) => r.id === participant.resultId
                        );

                        return UpsertResult$.parse({
                            id: participant.resultId,
                            competitionEventEid: event.eid,
                            inscriptionId: participant.inscriptionId || null,
                            bib: participant.bib,
                            athleteLicense: participant.license,
                            initialOrder: index + 1,
                            tempOrder: index + 1,
                            // Preserve details
                            details: existingResult?.details || [],
                        });
                    } else {
                        // It's a new participant
                        return UpsertResult$.parse({
                            competitionEventEid: event.eid,
                            inscriptionId: participant.inscriptionId || null,
                            bib: participant.bib,
                            athleteLicense: participant.license,
                            initialOrder: index + 1,
                            tempOrder: index + 1,
                        });
                    }
                }
            );

            // Send to API
            return upsertResults(
                competition.eid,
                UpsertResultType.LIVE,
                resultsToUpsert
            );
        },
        onSuccess: () => {
            // Invalidate the results query to trigger a refetch
            queryClient.invalidateQueries(['event-results', event.id]);

            if (onParticipantsUpdated) {
                onParticipantsUpdated();
            }
            onClose();
        },
        onError: (error) => {
            console.error('Error updating participants:', error);
        },
    });

    // Add an athlete from search to the participants list
    const handleAddExternalAthlete = (athlete: AthleteType) => {
        // Check if athlete is already in the list
        if (orderedParticipants.some((p) => p.license === athlete.license)) {
            return;
        }

        const newParticipant: Participant = {
            license: athlete.license,
            bib: athlete.bib,
            athlete: athlete,
            isSelected: true,
        };

        setOrderedParticipants((prev) => [...prev, newParticipant]);
        setSearchModalOpen(false);
    };

    return (
        <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
            <DialogTitle>{t('result:manageParticipants')}</DialogTitle>
            <DialogContent>
                <Box sx={{ mb: 3, textAlign: 'center' }}>
                    <Typography
                        variant="body1"
                        color="text.secondary"
                        sx={{ mt: 1 }}
                    >
                        {t('result:dragToReorderOrAddAthletes')}
                    </Typography>
                </Box>

                <Card
                    variant="outlined"
                    sx={{
                        mb: 3,
                    }}
                >
                    {orderedParticipants.length > 0 ? (
                        <DndContext
                            sensors={sensors}
                            collisionDetection={closestCenter}
                            onDragEnd={handleDragEnd}
                        >
                            <SortableContext
                                items={orderedParticipants.map(
                                    (p) => p.license
                                )}
                                strategy={verticalListSortingStrategy}
                            >
                                <List disablePadding>
                                    {orderedParticipants.map(
                                        (participant, index) => (
                                            <Box key={participant.license}>
                                                {index > 0 && (
                                                    <Divider component="li" />
                                                )}
                                                <SortableParticipantItem
                                                    participant={participant}
                                                    toggleSelection={() =>
                                                        toggleSelection(
                                                            participant.license
                                                        )
                                                    }
                                                    inscription={
                                                        participant.inscriptionId
                                                            ? inscriptions.find(
                                                                  (i) =>
                                                                      i.id ===
                                                                      participant.inscriptionId
                                                              )
                                                            : undefined
                                                    }
                                                    isCheckboxDisabled={
                                                        !!participant.resultId
                                                    }
                                                />
                                            </Box>
                                        )
                                    )}
                                </List>
                            </SortableContext>
                        </DndContext>
                    ) : (
                        <List disablePadding>
                            <ListItem>
                                <ListItemText
                                    primary={t('result:noParticipantsFound')}
                                />
                            </ListItem>
                        </List>
                    )}
                </Card>

                <Box sx={{ mb: 3 }}>
                    <Button
                        variant="outlined"
                        startIcon={<FontAwesomeIcon icon={faUserPlus} />}
                        fullWidth
                        sx={{ py: { xs: 1.5, sm: 1 } }}
                        onClick={() => setSearchModalOpen(true)}
                    >
                        {t('result:searchOtherAthletes')}
                    </Button>
                </Box>
            </DialogContent>
            <DialogActions>
                <Button onClick={onClose}>{t('buttons:cancel')}</Button>
                <Button
                    onClick={() => updateResultsMutation.mutate()}
                    variant="contained"
                    color="primary"
                    disabled={updateResultsMutation.isLoading}
                >
                    {t('buttons:save')}
                </Button>
            </DialogActions>

            {/* Search athlete modal */}
            <SearchAthleteModal
                open={searchModalOpen}
                onClose={() => setSearchModalOpen(false)}
                onSelectAthlete={handleAddExternalAthlete}
                competitionDate={competition.date}
            />
        </Dialog>
    );
};
