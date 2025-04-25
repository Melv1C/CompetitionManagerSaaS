import { EventType } from '@competition-manager/schemas';
import { sortPerf } from './sortPerf';

export const isFirstPerfBetter = (
    perf1: number,
    perf2: number,
    type: EventType
) => {
    return sortPerf(perf1, perf2, type) <= 0;
};
