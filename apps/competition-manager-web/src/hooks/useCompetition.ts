import { competitionAtom } from '@/GlobalsStates';
import { useAtomValue } from 'jotai';

export const useCompetition = () => {
    const competition = useAtomValue(competitionAtom);
    if (!competition) throw new Error('No competition found');

    const now = new Date();

    const startDate = competition.date;
    startDate.setHours(0, 0, 0, 0);
    const endDate = competition.closeDate || competition.date;
    endDate.setHours(0, 0, 0, 0);
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const isPast = today > endDate;
    const isFuture = today < startDate;
    const isCurrent = !isPast && !isFuture;

    const isInscriptionOpen =
        now >= competition.startInscriptionDate &&
        now <= competition.endInscriptionDate;

    return {
        isPast,
        isFuture,
        isCurrent,
        isInscriptionOpen,
    };
};
