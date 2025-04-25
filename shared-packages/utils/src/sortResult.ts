import { AttemptValue, EventType, Result } from '@competition-manager/schemas';
import { sortPerf } from './sortPerf';

export const sortResult = (result1: Result, result2: Result) => {
    if (!result1.value) return 1;
    if (!result2.value) return -1;
    if (result1.value < 0) return 1;
    if (result2.value < 0) return -1;
    if (result1.value !== result2.value) {
        return sortPerf(
            result1.value,
            result2.value,
            result1.competitionEvent.event.type
        );
    }
    switch (result1.competitionEvent.event.type) {
        case EventType.TIME:
            return 0; // No way to break a tie in time events
        case EventType.DISTANCE:
            const sortedDetails1 = result1.details.sort((a, b) =>
                sortPerf(a.value, b.value, EventType.DISTANCE)
            );
            const sortedDetails2 = result2.details.sort((a, b) =>
                sortPerf(a.value, b.value, EventType.DISTANCE)
            );
            for (let i = 0; i < sortedDetails1.length; i++) {
                if (sortedDetails1[i].value !== sortedDetails2[i].value) {
                    return sortPerf(
                        sortedDetails1[i].value,
                        sortedDetails2[i].value,
                        EventType.DISTANCE
                    );
                }
            }
            return 0; // All details are equal, so the results are equal
        case EventType.HEIGHT:
            // Compare the number of fails (X) in the last attempt
            const nbOfFails1 = result1.details
                .find((detail) => detail.value === result1.value)!
                .attempts.filter(
                    (attempt) => attempt === AttemptValue.X
                ).length;
            const nbOfFails2 = result2.details
                .find((detail) => detail.value === result2.value)!
                .attempts.filter(
                    (attempt) => attempt === AttemptValue.X
                ).length;
            if (nbOfFails1 !== nbOfFails2) {
                return nbOfFails1 - nbOfFails2; // Fewer fails is better
            }
            // If the number of fails in the last attempt is the same
            // Compare the number of fails (X) in all attempts
            const totalFails1 = result1.details.reduce(
                (total, detail) =>
                    total +
                    detail.attempts.filter(
                        (attempt) => attempt === AttemptValue.X
                    ).length,
                0
            );
            const totalFails2 = result2.details.reduce(
                (total, detail) =>
                    total +
                    detail.attempts.filter(
                        (attempt) => attempt === AttemptValue.X
                    ).length,
                0
            );
            if (totalFails1 !== totalFails2) {
                return totalFails1 - totalFails2; // Fewer fails is better
            }
            // If the number of fails in all attempts is the same
            return 0; // The results are equal

        case EventType.POINTS:
            return 0; // No way to break a tie in points events
        default:
            return 0; // Should not happen, but just in case
    }
};
