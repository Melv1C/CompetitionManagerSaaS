import { upsertResults } from '@/api';
import { adminInscriptionsAtom, competitionAtom } from '@/GlobalsStates';
import {
    Athlete as AthleteType,
    Bib as BibType,
    CompetitionEvent,
    Id,
    InscriptionStatus,
    License,
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
import { faCheckCircle, faUserPlus } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
    Alert,
    Box,
    Button,
    Card,
    Divider,
    List,
    ListItem,
    ListItemText,
    Typography,
} from '@mui/material';
import { useAtomValue } from 'jotai';
import { useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useMutation } from 'react-query';
import { SearchAthleteModal } from './SearchAthleteModal';
import { SortableParticipantItem } from './SortableParticipantItem';

// Simplified Participant type with only required properties
type Participant = {
    license: License; // Athlete license (used as unique ID)
    bib: BibType; // Athlete bib number
    athlete: AthleteType; // Full athlete data
    inscriptionId?: Id; // Optional inscription ID (missing for external athletes)
    isSelected: boolean; // Whether this participant is selected
};

interface ParticipantsSelectorProps {
    event: CompetitionEvent;
    onResultsCreated: () => void;
}

export const ParticipantsSelector: React.FC<ParticipantsSelectorProps> = ({
    event,
    onResultsCreated,
}) => {
    const { t } = useTranslation();
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

    // Filter inscriptions for the current event and with status ACCEPTED or CONFIRMED
    const inscriptions = useMemo(() => {
        const filtered = adminInscriptions.filter(
            (inscription) =>
                inscription.competitionEvent.id === event.id &&
                !inscription.isDeleted &&
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

    // Initialize orderedParticipants from inscriptions
    useEffect(() => {
        if (inscriptions.length > 0) {
            const participants = inscriptions.map((inscription) => ({
                license: inscription.athlete.license,
                bib: inscription.athlete.bib,
                athlete: { ...inscription.athlete, club: inscription.club },
                inscriptionId: inscription.id,
                isSelected: inscription.status === InscriptionStatus.CONFIRMED,
            }));
            setOrderedParticipants(participants);
        }
    }, [inscriptions]);

    // Configure sensors for drag and drop
    const sensors = useSensors(
        useSensor(PointerSensor, {
            activationConstraint: {
                distance: 10,
            },
        })
    );

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

    const createEmptyResults = async (participants: Participant[]) => {
        // Map selected participants to create results with proper ordering
        const results = participants
            .filter((p) => p.isSelected)
            .map((participant, index) => {
                return UpsertResult$.parse({
                    competitionEventEid: event.eid,
                    inscriptionId: participant.inscriptionId || null,
                    bib: participant.bib,
                    athleteLicense: participant.license,
                    initialOrder: index + 1,
                    tempOrder: index + 1,
                });
            });

        return upsertResults(competition.eid, UpsertResultType.LIVE, results);
    };

    // Create empty results mutation
    const createEmptyResultsMutation = useMutation({
        mutationFn: createEmptyResults,
        onSuccess: () => {
            // Invalidate all results for the competition
            onResultsCreated();
        },
        onError: (error) => {
            console.error('Error creating empty results:', error);
        },
    });

    // Toggle selection for a participant
    const toggleSelection = (license: License) => {
        setOrderedParticipants((prev) =>
            prev.map((p) =>
                p.license === license ? { ...p, isSelected: !p.isSelected } : p
            )
        );
    };

    // Select or deselect all participants
    const toggleAll = (select: boolean) => {
        setOrderedParticipants((prev) =>
            prev.map((p) => ({ ...p, isSelected: select }))
        );
    };

    // Start encoding with selected participants
    const handleStartEncoding = () => {
        if (orderedParticipants.filter((p) => p.isSelected).length === 0) {
            return; // Don't create results if no participants selected
        }

        createEmptyResultsMutation.mutate(orderedParticipants);
    };

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

    // If there are no inscriptions for this event
    if (inscriptions.length === 0) {
        return (
            <Box sx={{ p: 3, textAlign: 'center' }}>
                <Alert severity="info" sx={{ mb: 2 }}>
                    {t('result:noInscriptionsForEvent')}
                </Alert>
                <Button
                    variant="outlined"
                    startIcon={<FontAwesomeIcon icon={faUserPlus} />}
                    onClick={() => setSearchModalOpen(true)}
                >
                    {t('result:searchOtherAthletes')}
                </Button>
            </Box>
        );
    }

    return (
        <>
            <Box sx={{ mb: 3, textAlign: 'center' }}>
                <Typography
                    variant="h5"
                    component="h2"
                    color="primary"
                    fontWeight="bold"
                    sx={{ fontSize: { xs: '1.2rem', sm: '1.5rem' } }}
                >
                    {t('result:selectParticipants')}
                </Typography>
                <Typography
                    variant="body1"
                    color="text.secondary"
                    sx={{ mt: 1 }}
                >
                    {t('result:selectParticipantsDescription')}
                </Typography>
            </Box>

            <Box
                sx={{
                    mb: 1,
                    display: 'flex',
                    justifyContent: 'flex-start',
                    gap: 1,
                }}
            >
                <Button
                    variant="outlined"
                    size="small"
                    onClick={() => toggleAll(true)}
                >
                    {t('buttons:selectAll')}
                </Button>
                <Button
                    variant="outlined"
                    size="small"
                    onClick={() => toggleAll(false)}
                >
                    {t('buttons:deselectAll')}
                </Button>
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
                            items={orderedParticipants.map((p) => p.license)}
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
                                primary={t('result:noMatchingInscriptions')}
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

            <Box sx={{ textAlign: 'center' }}>
                <Button
                    variant="contained"
                    color="primary"
                    size="large"
                    startIcon={<FontAwesomeIcon icon={faCheckCircle} />}
                    onClick={handleStartEncoding}
                    disabled={
                        createEmptyResultsMutation.isLoading ||
                        orderedParticipants.filter((p) => p.isSelected)
                            .length === 0
                    }
                >
                    {t('result:startEncodingResults')}
                </Button>
                {createEmptyResultsMutation.isLoading && (
                    <Typography
                        variant="caption"
                        color="text.secondary"
                        sx={{ mt: 1, display: 'block' }}
                    >
                        {t('glossary:processing')}...
                    </Typography>
                )}
            </Box>

            {/* Search athlete modal */}
            <SearchAthleteModal
                open={searchModalOpen}
                onClose={() => setSearchModalOpen(false)}
                onSelectAthlete={handleAddExternalAthlete}
                competitionDate={competition.date}
            />
        </>
    );
};
