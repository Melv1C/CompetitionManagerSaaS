import { Result } from '@competition-manager/schemas';
import { sortResult } from './sortResult';

export const isFirstResultBetter = (a: Result, b: Result) => {
    return sortResult(a, b) <= 0;
};
