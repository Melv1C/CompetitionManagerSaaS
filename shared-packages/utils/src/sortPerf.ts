import { EventType } from '@competition-manager/schemas';

export const sortPerf = (perf1: number, perf2: number, type: EventType) => {
    if (perf1 < 0) {
        // Handling negative performance values, possibly for DNS errors or similar edge cases
        return 1;
    }
    if (perf2 < 0) {
        return -1;
    }
    if (type === EventType.TIME) {
        return perf1 - perf2;
    }
    return perf2 - perf1;
};
