import { EventType } from "@competition-manager/schemas";

export const isBestResult = (perf1: number, perf2: number, type: EventType) => {
    if (perf1 < 0) {   // maybe usefull for code dns or thing like that
        return false;
    }
    if (perf2 < 0) {
        return true;
    }
    if (type === EventType.TIME) {
        return perf1 < perf2;
    }
    return perf1 > perf2;
};



