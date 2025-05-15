import { upsertResults } from '@/api';
import { adminInscriptionsAtom, competitionAtom } from '@/GlobalsStates';
import {
    Bib as BibType,
    CompetitionEvent,
    Id,
    Inscription,
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
import { SortableInscriptionItem } from './SortableInscriptionItem';

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

    const [selectedInscriptions, setSelectedInscriptions] = useState<
        Record<number, boolean>
    >({});

    // State for ordered inscriptions
    const [orderedInscriptions, setOrderedInscriptions] = useState<
        Inscription[]
    >([]);

    // Filter inscriptions for the current event and with status ACCEPTED or CONFIRMED
    const inscriptions = useMemo(() => {
        const filtered = adminInscriptions.filter(
            (inscription) =>
                inscription.competitionEvent.id === event.id &&
                (inscription.status === InscriptionStatus.ACCEPTED ||
                    inscription.status === InscriptionStatus.CONFIRMED)
        );

        // Sort by performance record if available
        return filtered.sort((a, b) =>
            sortPerf(
                a.record?.perf ?? 0,
                b.record?.perf ?? 0,
                a.competitionEvent.event.type
            )
        );
    }, [adminInscriptions, event.id]);

    // Update ordered inscriptions when inscriptions change
    useEffect(() => {
        setOrderedInscriptions(inscriptions);
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
            setOrderedInscriptions((items) => {
                const oldIndex = items.findIndex(
                    (item) => item.id === active.id
                );
                const newIndex = items.findIndex((item) => item.id === over.id);
                return arrayMove(items, oldIndex, newIndex);
            });
        }
    };

    const createEmptyResults = async (
        data: {
            inscriptionId: Id;
            bib: BibType;
            athleteLicense: License;
        }[]
    ) => {
        // Map selected inscriptions to create results with proper ordering
        const results = data.map(
            ({ inscriptionId, bib, athleteLicense }, index: number) => {
                return UpsertResult$.parse({
                    competitionEventEid: event.eid,
                    inscriptionId: inscriptionId,
                    bib: bib,
                    athleteLicense: athleteLicense,
                    initialOrder: index + 1,
                    tempOrder: index + 1,
                });
            }
        );

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

    // Initialize only CONFIRMED inscriptions as selected by default
    useEffect(() => {
        if (inscriptions && inscriptions.length > 0) {
            const initialSelected: Record<number, boolean> = {};
            inscriptions.forEach((inscription) => {
                initialSelected[inscription.id] =
                    inscription.status === InscriptionStatus.CONFIRMED;
            });
            setSelectedInscriptions(initialSelected);
        }
    }, [inscriptions]);

    // Toggle selection for an inscription
    const toggleSelection = (id: number) => {
        setSelectedInscriptions((prev) => ({
            ...prev,
            [id]: !prev[id],
        }));
    };

    // Select or deselect all inscriptions
    const toggleAll = (select: boolean) => {
        const newSelection: Record<number, boolean> = {};
        inscriptions.forEach((inscription) => {
            newSelection[inscription.id] = select;
        });
        setSelectedInscriptions(newSelection);
    };

    // Start encoding with selected participants
    const handleStartEncoding = () => {
        // Get selected inscriptions in the current order
        const selectedItems = orderedInscriptions
            .filter((inscription) => selectedInscriptions[inscription.id])
            .map((inscription) => ({
                inscriptionId: inscription.id,
                bib: inscription.bib,
                athleteLicense: inscription.athlete.license,
            }));

        if (selectedItems.length === 0) {
            return; // Don't create results if no inscriptions selected
        }

        createEmptyResultsMutation.mutate(selectedItems);
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
                >
                    {t('result:searchOtherAthletes')}
                </Button>
                <Typography
                    variant="caption"
                    color="text.secondary"
                    sx={{ mt: 1, display: 'block' }}
                >
                    {t('result:comingSoon')}
                </Typography>
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
                {orderedInscriptions.length > 0 ? (
                    <DndContext
                        sensors={sensors}
                        collisionDetection={closestCenter}
                        onDragEnd={handleDragEnd}
                    >
                        <SortableContext
                            items={orderedInscriptions.map((item) => item.id)}
                            strategy={verticalListSortingStrategy}
                        >
                            <List disablePadding>
                                {orderedInscriptions.map(
                                    (inscription, index) => (
                                        <Box key={inscription.id}>
                                            {index > 0 && (
                                                <Divider component="li" />
                                            )}
                                            <SortableInscriptionItem
                                                inscription={inscription}
                                                isSelected={
                                                    !!selectedInscriptions[
                                                        inscription.id
                                                    ]
                                                }
                                                toggleSelection={
                                                    toggleSelection
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
                >
                    {t('result:searchOtherAthletes')}
                </Button>
                <Typography
                    variant="caption"
                    color="text.secondary"
                    sx={{ mt: 0.5, display: 'block', textAlign: 'center' }}
                >
                    {t('result:comingSoon')}
                </Typography>
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
                        Object.values(selectedInscriptions).filter(Boolean)
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
        </>
    );
};
