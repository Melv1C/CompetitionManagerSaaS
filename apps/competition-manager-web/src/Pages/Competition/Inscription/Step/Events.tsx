import { CompetitionEvent } from "@competition-manager/schemas";
import { Box, Checkbox, List, ListItem, ListItemAvatar, ListItemButton, ListItemText } from "@mui/material"
import { useTranslation } from "react-i18next";
import { StepperButtons } from "../../../../Components";
import { useAtom, useAtomValue } from "jotai";
import { competitionAtom, inscriptionDataAtom, inscriptionsAtom } from "../../../../GlobalsStates";
import { checkCategory, getRemainingPlaces } from "@competition-manager/utils";
import { useMemo } from "react";

type EventsProps = {
    handleNext: () => void;
    handleBack: () => void;
}

export const Events = ({ handleNext, handleBack }: EventsProps) => {

    const { t } = useTranslation();

    const competition = useAtomValue(competitionAtom);
    const inscriptions = useAtomValue(inscriptionsAtom)

    if (!competition) throw new Error('Competition not found')
    if (!inscriptions) throw new Error('Inscriptions not found')

    const [{ athlete, selectedEvents }, setInscriptionData] = useAtom(inscriptionDataAtom)

    if (!athlete) throw new Error('Athlete not found')

    const events = competition.events.filter((event) => checkCategory(event, athlete, competition.date)) || [];

    const toggleEvent = (event: CompetitionEvent) => {
        if (selectedEvents.some((e) => e.id === event.id)) {
            setInscriptionData((prev) => ({
                ...prev,
                selectedEvents: prev.selectedEvents.filter((e) => e.id !== event.id)
            }))
        } else {
            setInscriptionData((prev) => ({
                ...prev,
                selectedEvents: [...prev.selectedEvents, event]
            }))
        }
    }

    /**
     * Show the cost (if greater than 0) of the selected events
     * Show the remaining places of the event (if less than 15)
     * @param event The event to show the secondary text
     * @returns The secondary text
    */

    const secondaryText = (event: CompetitionEvent) => {
        const cost = event.cost;
        const remainingPlaces = event.place ? getRemainingPlaces(event, inscriptions) : 100;
        
        return (
            <>
                {cost > 0 && (
                    <Box component="span" mr={2}>
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

    const totalCost = useMemo(() => selectedEvents.reduce((total, event) => total + event.cost, 0), [selectedEvents])

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
                                {event.schedule.toLocaleTimeString(undefined, { hour: '2-digit', minute: '2-digit' })}
                            </ListItemAvatar>
                            <ListItemText
                                primary={event.name}
                                secondary={secondaryText(event)}
                            />
                        </ListItemButton>
                    </ListItem>
                ))}
            </List>

            {totalCost > 0 && (
                <Box display="flex" justifyContent="flex-end" mt={2}>
                    {t('inscription:totalCost')}: {totalCost}€
                    {/* TODO: Need to specify if the payment is online or in place */}
                </Box>
            )}

            <StepperButtons 
                buttons={[
                    { label: t('buttons:previous'), onClick: handleBack, variant: 'outlined' },
                    { label: t('buttons:next'), onClick: handleNext, disabled: selectedEvents.length === 0 }
                ]}
            />
        </Box>
    )
}
