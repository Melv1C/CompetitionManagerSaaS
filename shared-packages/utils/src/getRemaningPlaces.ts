import { CompetitionEvent, DisplayInscription } from "@competition-manager/schemas"

/**
 * Get the remaining places of the event
 * @param event The event to get the remaining places
 * @param inscriptions The inscriptions of the competition
 * @returns The remaining places
 */
export const getRemainingPlaces = (event: CompetitionEvent, inscriptions: DisplayInscription[]): number => {
    if (!event.place) throw new Error('Event has no place limit')
    const eventInscriptions = inscriptions.filter((inscription) => inscription.competitionEvent.id === event.id)
    return event.place - eventInscriptions.length
}