
const BASE_FEE = 0.35;
const VARIABLE_RATE = 0.02;

/**
 * Calculate the fees for a given total
 * @param total
 * @returns the fees
 */

export const getFees = (total: number) => {
    if (total <= 0) {
        return 0;
    }
    return BASE_FEE + VARIABLE_RATE * total;
};
