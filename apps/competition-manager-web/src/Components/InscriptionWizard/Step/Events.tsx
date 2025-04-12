import { StepperButtons } from '@/Components';
import { CompetitionEvent } from '@competition-manager/schemas';
import {
    checkCategory,
    getRemainingPlaces,
    isAthleteInAFreeClub,
} from '@competition-manager/utils';
import {
    Alert,
    Box,
    Checkbox,
    List,
    ListItem,
    ListItemAvatar,
    ListItemButton,
    ListItemText,
} from '@mui/material';
import { useAtom, useAtomValue } from 'jotai';
import { useEffect, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import {
    competitionAtom,
    inscriptionDataAtom,
    inscriptionsAtom,
    userInscriptionsAtom,
} from '../../../GlobalsStates';

type EventsProps = {
    isAdmin: boolean;
    handleNext: () => void;
    handleBack: () => void;
};

export const Events = ({ isAdmin, handleNext, handleBack }: EventsProps) => {
    const { currentInscriptions } = useGetCurrentInscription(isAdmin);

    const { t } = useTranslation();

    const competition = useAtomValue(competitionAtom);
    const inscriptions = useAtomValue(inscriptionsAtom);
    if (!competition) throw new Error('Competition not found');
    if (!inscriptions) throw new Error('Inscriptions not found');

    const [{ athlete, inscriptionsData }, setInscriptionData] =
        useAtom(inscriptionDataAtom);
    if (!athlete) throw new Error('Athlete not found');

    const selectedEvents = useMemo(
        () =>
            inscriptionsData.map((inscription) => inscription.competitionEvent),
        [inscriptionsData]
    );
    const isDisabledDueToMaxEvents = useMemo(
        () =>
            competition.maxEventByAthlete
                ? selectedEvents.length >= competition.maxEventByAthlete
                : false,
        [competition, selectedEvents]
    );

    const events = useMemo(
        () =>
            competition.events
                .filter((event) => !event.parentId)
                .filter((event) =>
                    checkCategory(event, athlete, competition.date)
                ) || [],
        [competition, athlete]
    );

    const toggleEvent = (event: CompetitionEvent) => {
        // Find any child events (events where parentId === event.id)
        const childEvents = competition.events.filter(e => e.parentId === event.id);
        
        if (selectedEvents.some((e) => e.id === event.id)) {
            // Remove the main event and its child events
            setInscriptionData((prev) => ({
                ...prev,
                inscriptionsData: prev.inscriptionsData.filter(
                    (inscription) => 
                        inscription.competitionEvent.id !== event.id && 
                        !childEvents.some(child => child.id === inscription.competitionEvent.id)
                ),
            }));
            return;
        }
        
        // Handling when we're adding the event
        const currentInscription = currentInscriptions.find(
            (inscription) => inscription.competitionEvent.id === event.id
        );
        
        // Get child inscriptions if they exist
        const childInscriptions = childEvents.map(childEvent => {
            const existingInscription = currentInscriptions.find(
                inscription => inscription.competitionEvent.id === childEvent.id
            );
            
            return existingInscription || {
                eid: '',
                competitionEvent: childEvent,
                record: undefined,
                paid: 0,
            };
        });
        
        if (currentInscription) {
            setInscriptionData((prev) => ({
                ...prev,
                inscriptionsData: [
                    ...prev.inscriptionsData,
                    currentInscription,
                    ...childInscriptions
                ],
            }));
            return;
        }
        
        setInscriptionData((prev) => ({
            ...prev,
            inscriptionsData: [
                ...prev.inscriptionsData,
                {
                    eid: '',
                    competitionEvent: event,
                    record: undefined,
                    paid: 0,
                },
                ...childInscriptions
            ],
        }));
    };

    /**
     * Show the cost (if greater than 0) of the selected events
     * Show the remaining places of the event (if less than 15)
     * @param event The event to show the secondary text
     * @returns The secondary text
     */

    const secondaryText = (event: CompetitionEvent) => {
        const cost = isAthleteInAFreeClub(competition, athlete)
            ? 0
            : event.cost;
        const remainingPlaces = event.place
            ? getRemainingPlaces(event, inscriptions)
            : 100;

        return (
            <>
                {cost > 0 && (
                    <Box
                        component="span"
                        mr={2}
                        sx={{ color: 'primary.main', fontWeight: 'bold' }}
                    >
                        {cost}€
                    </Box>
                )}
                {remainingPlaces <= 15 && remainingPlaces >= 10 && (
                    <Box component="span" color="success.main">
                        {remainingPlaces} {t('competition:remainingPlaces')}
                    </Box>
                )}
                {remainingPlaces < 10 && remainingPlaces >= 5 && (
                    <Box component="span" color="warning.main">
                        {remainingPlaces} {t('competition:remainingPlaces')}
                    </Box>
                )}
                {remainingPlaces < 5 && remainingPlaces >= 2 && (
                    <Box component="span" color="error.main">
                        {remainingPlaces} {t('competition:remainingPlaces')}
                    </Box>
                )}
                {remainingPlaces === 1 && (
                    <Box component="span" color="error.main">
                        {remainingPlaces} {t('competition:remainingPlace')}
                    </Box>
                )}
                {remainingPlaces <= 0 && (
                    <Box component="span" color="error.main">
                        {t('competition:noRemainingPlaces')}
                    </Box>
                )}
            </>
        );
    };

    return (
        <Box width={1}>
            {competition.maxEventByAthlete && (
                <Alert severity="info" sx={{ mb: 2 }}>
                    {competition.maxEventByAthlete === 1
                        ? t('competition:maxEventByAthlete', {
                              count: competition.maxEventByAthlete,
                          })
                        : t('competition:maxEventsByAthlete', {
                              count: competition.maxEventByAthlete,
                          })}
                </Alert>
            )}

            {events.length === 0 && (
                <Alert severity="warning">
                    {t('competition:noEventForCategory')}
                </Alert>
            )}

            <List sx={{ maxWidth: 400, margin: 'auto' }}>
                {events
                    .sort((a, b) => a.schedule.getTime() - b.schedule.getTime())
                    .map((event, index) => {
                        const isDisabled =
                            !isAdmin &&
                            ((!currentInscriptions.some(
                                (inscription) =>
                                    inscription.competitionEvent.id === event.id
                            ) && event.place
                                ? getRemainingPlaces(event, inscriptions) <= 0
                                : false) ||
                                (!selectedEvents.some(
                                    (e) => e.id === event.id
                                ) &&
                                    isDisabledDueToMaxEvents));

                        return (
                            <ListItem
                                key={index}
                                disablePadding
                                secondaryAction={
                                    <Checkbox
                                        edge="end"
                                        checked={selectedEvents.some(
                                            (e) => e.id === event.id
                                        )}
                                        onChange={() => toggleEvent(event)}
                                        disabled={isDisabled}
                                    />
                                }
                            >
                                <ListItemButton
                                    onClick={() => toggleEvent(event)}
                                    disabled={isDisabled}
                                >
                                    <ListItemAvatar>
                                        {event.schedule.toLocaleTimeString(
                                            'fr',
                                            {
                                                hour: '2-digit',
                                                minute: '2-digit',
                                            }
                                        )}
                                    </ListItemAvatar>
                                    <ListItemText
                                        primary={event.name}
                                        secondary={secondaryText(event)}
                                    />
                                </ListItemButton>
                            </ListItem>
                        );
                    })}
            </List>

            <StepperButtons
                buttons={[
                    {
                        label: t('buttons:previous'),
                        onClick: handleBack,
                        variant: 'outlined',
                    },
                    {
                        label: t('buttons:next'),
                        onClick: handleNext,
                        disabled: selectedEvents.length === 0,
                    },
                ]}
            />
        </Box>
    );
};

const useGetCurrentInscription = (isAdmin: boolean) => {
    const userInscriptions = useAtomValue(userInscriptionsAtom);
    const inscriptions = useAtomValue(inscriptionsAtom);
    if (!userInscriptions) throw new Error('User inscriptions not found');
    if (!inscriptions) throw new Error('Inscriptions not found');
    const [{ athlete, inscriptionsData }, setInscriptionData] =
        useAtom(inscriptionDataAtom);
    if (!athlete) throw new Error('Athlete not found');

    const currentUserInscriptions = useMemo(
        () =>
            userInscriptions
                .filter(
                    (inscription) =>
                        inscription.athlete.license === athlete.license
                )
                .map((inscription) => ({
                    eid: inscription.eid,
                    competitionEvent: inscription.competitionEvent,
                    record: inscription.record,
                    paid: inscription.paid,
                })),
        [athlete, userInscriptions]
    );

    const currentInscriptions = useMemo(
        () =>
            inscriptions
                .filter(
                    (inscription) =>
                        inscription.athlete.license === athlete.license
                )
                .map((inscription) => ({
                    eid: inscription.eid,
                    competitionEvent: inscription.competitionEvent,
                    record: inscription.record,
                    paid: 0,
                })),
        [athlete, inscriptions]
    );

    useEffect(() => {
        if (inscriptionsData.length > 0) return;

        if (currentUserInscriptions.length > 0) {
            setInscriptionData((prev) => ({
                ...prev,
                inscriptionsData: currentUserInscriptions,
            }));
            return;
        }
        if (isAdmin && currentInscriptions.length > 0) {
            setInscriptionData((prev) => ({
                ...prev,
                inscriptionsData: currentInscriptions,
            }));
        }
    }, [
        currentUserInscriptions,
        currentInscriptions,
        isAdmin,
        inscriptionsData.length,
        setInscriptionData,
    ]);

    return {
        currentInscriptions:
            currentUserInscriptions.length > 0
                ? currentUserInscriptions
                : isAdmin
                ? currentInscriptions
                : [],
    };
};
