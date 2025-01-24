import { useAtomValue } from "jotai";
import { competitionAtom } from "../GlobalsStates";

export const useCompetition = () => {

    const competition = useAtomValue(competitionAtom);
    if (!competition) throw new Error('No competition found');

    const startDate = competition.date;
    const closeDate = competition.closeDate || competition.date;
    const today = new Date();
    // Normalize time to 00:00:00
    startDate.setHours(0, 0, 0, 0);
    closeDate.setHours(0, 0, 0, 0);
    today.setHours(0, 0, 0, 0);

    const isPast = today > closeDate;
    const isFuture = today < startDate;
    const isCurrent = !isPast && !isFuture;

    return { isPast, isFuture, isCurrent };
}
    
