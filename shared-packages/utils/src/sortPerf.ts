import { EventType } from '@competition-manager/schemas';

export const sortPerf = (perf1: number, perf2: number, type: EventType) => {
    if (perf1 < 0) {
        // maybe usefull for code dns or thing like that
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
