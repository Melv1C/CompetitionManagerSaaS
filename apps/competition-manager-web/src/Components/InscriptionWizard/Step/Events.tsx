import { CompetitionEvent } from "@competition-manager/schemas";
import { Box, Checkbox, List, ListItem, ListItemAvatar, ListItemButton, ListItemText } from "@mui/material"
import { useTranslation } from "react-i18next";
import { StepperButtons } from "../../../Components";
import { useAtom, useAtomValue } from "jotai";
import { competitionAtom, inscriptionDataAtom, inscriptionsAtom, userInscriptionsAtom } from "../../../GlobalsStates";
import { checkCategory, getRemainingPlaces, isAthleteInAFreeClub } from "@competition-manager/utils";
import { useEffect, useMemo } from "react";

type EventsProps = {
    isAdmin: boolean;
    handleNext: () => void;
    handleBack: () => void;
}

export const Events = ({ isAdmin, handleNext, handleBack }: EventsProps) => {

    const { currentInscriptions } = useGetCurrentInscription(isAdmin);

    const { t } = useTranslation();

    const competition = useAtomValue(competitionAtom);
    const inscriptions = useAtomValue(inscriptionsAtom);
    if (!competition) throw new Error('Competition not found');
    if (!inscriptions) throw new Error('Inscriptions not found');

    const [{ athlete, inscriptionsData }, setInscriptionData] = useAtom(inscriptionDataAtom);
    if (!athlete) throw new Error('Athlete not found');

    const selectedEvents = useMemo(() => inscriptionsData.map((inscription) => inscription.competitionEvent), [inscriptionsData]);

    const events = useMemo(() => competition.events.filter((event) => !event.parentId).filter((event) => checkCategory(event, athlete, competition.date)) || [], [competition, athlete]);

    const toggleEvent = (event: CompetitionEvent) => {
        if (selectedEvents.some((e) => e.id === event.id)) {
            setInscriptionData((prev) => ({
                ...prev,
                inscriptionsData: prev.inscriptionsData.filter((inscription) => inscription.competitionEvent.id !== event.id)
            }))
            return;
        }
        const currentInscription = currentInscriptions.find((inscription) => inscription.competitionEvent.id === event.id);
        if (currentInscription) {
            setInscriptionData((prev) => ({
                ...prev,
                inscriptionsData: [...prev.inscriptionsData, currentInscription]
            }))
            return;
        }
        setInscriptionData((prev) => ({
            ...prev,
            inscriptionsData: [...prev.inscriptionsData, { eid: '', competitionEvent: event, record: undefined, paid: 0 }]
        }))
    }

    /**
     * Show the cost (if greater than 0) of the selected events
     * Show the remaining places of the event (if less than 15)
     * @param event The event to show the secondary text
     * @returns The secondary text
    */

    const secondaryText = (event: CompetitionEvent) => {
        const cost = isAthleteInAFreeClub(competition, athlete) ? 0 : event.cost;
        const remainingPlaces = event.place ? getRemainingPlaces(event, inscriptions) : 100;
        
        return (
            <>
                {cost > 0 && (
                    <Box component="span" mr={2} sx={{ color: 'primary.main', fontWeight: 'bold' }}>
                        {cost}€
                    </Box>
                )}
                {remainingPlaces <= 15 && remainingPlaces >= 10 && (
                    <Box component="span" color="success.main">
                        {remainingPlaces} {t('inscription:remainingPlaces')}
                    </Box>
                )}
                {remainingPlaces < 10 && remainingPlaces >= 5 && (
                    <Box component="span" color="warning.main">
                        {remainingPlaces} {t('inscription:remainingPlaces')}
                    </Box>
                )}
                {remainingPlaces < 5 && remainingPlaces >= 2 && (
                    <Box component="span" color="error.main">
                        {remainingPlaces} {t('inscription:remainingPlaces')}
                    </Box>
                )}
                {remainingPlaces === 1 && (
                    <Box component="span" color="error.main">
                        {remainingPlaces} {t('inscription:remainingPlace')}
                    </Box>
                )}
                {remainingPlaces <= 0 && (
                    <Box component="span" color="error.main">
                        {t('inscription:noRemainingPlaces')}
                    </Box>
                )}
            </>
        )
    }

    return (
        <Box width={1}>
            <List sx={{ width: '100%', bgcolor: 'background.paper' }}>
                {events.sort((a, b) => a.schedule.getTime() - b.schedule.getTime()).map((event, index) => (
                    <ListItem
                        key={index}
                        disablePadding 
                        secondaryAction={
                            <Checkbox
                                edge="end"
                                checked={selectedEvents.some((e) => e.id === event.id)}
                                onChange={() => toggleEvent(event)}
                            />
                        }
                    >
                        <ListItemButton onClick={() => toggleEvent(event)}>
                            <ListItemAvatar>
                                {event.schedule.toLocaleTimeString('fr', { hour: '2-digit', minute: '2-digit' })}
                            </ListItemAvatar>
                            <ListItemText
                                primary={event.name}
                                secondary={secondaryText(event)}
                            />
                        </ListItemButton>
                    </ListItem>
                ))}
            </List>

            <StepperButtons 
                buttons={[
                    { label: t('buttons:previous'), onClick: handleBack, variant: 'outlined' },
                    { label: t('buttons:next'), onClick: handleNext, disabled: selectedEvents.length === 0 }
                ]}
            />
        </Box>
    )
}


const useGetCurrentInscription = (isAdmin: boolean) => {
    const userInscriptions = useAtomValue(userInscriptionsAtom);
    const inscriptions = useAtomValue(inscriptionsAtom);
    if (!userInscriptions) throw new Error('User inscriptions not found');
    if (!inscriptions) throw new Error('Inscriptions not found');
    const [{ athlete,inscriptionsData }, setInscriptionData] = useAtom(inscriptionDataAtom);
    if (!athlete) throw new Error('Athlete not found');

    const currentUserInscriptions = useMemo(() => 
        userInscriptions.filter((inscription) => inscription.athlete.license === athlete.license).map((inscription) => ({
            eid: inscription.eid,
            competitionEvent: inscription.competitionEvent,
            record: inscription.record,
            paid: inscription.paid
        }))
    , [athlete, userInscriptions]);

    const currentInscriptions = useMemo(() => 
        inscriptions.filter((inscription) => inscription.athlete.license === athlete.license).map((inscription) => ({
            eid: inscription.eid,
            competitionEvent: inscription.competitionEvent,
            record: inscription.record,
            paid: 0
        }))
    , [athlete, inscriptions]);

    useEffect(() => {
        if (inscriptionsData.length > 0) return;

        if (currentUserInscriptions.length > 0) {
            setInscriptionData((prev) => ({
                ...prev,
                inscriptionsData: currentUserInscriptions
            }))
            return;
        }
        if (isAdmin && currentInscriptions.length > 0) {
            setInscriptionData((prev) => ({
                ...prev,
                inscriptionsData: currentInscriptions
            }))
        }
    }, [currentUserInscriptions, currentInscriptions, setInscriptionData])

    return { currentInscriptions: currentUserInscriptions.length > 0 ? currentUserInscriptions : isAdmin ? currentInscriptions : [] }
}
