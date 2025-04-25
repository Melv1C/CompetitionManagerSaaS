import { AttemptValue, Id, Result } from '@competition-manager/schemas';

/**
 * Check if an athlete is retired (has ResultDetailCode.R in any previous attempt)
 */
export const isAthleteRetired = (resultId: Id, results: Result[]): boolean => {
    const result = results.find((r) => r.id === resultId);
    if (!result) return false;

    // Check if any result detail has code 'r' (retired)
    return result.details.some((detail) =>
        detail.attempts?.includes(AttemptValue.R)
    );
};

/**
 * Check if a height should be disabled for an athlete
 */
export const isHeightDisabled = (
    resultId: Id,
    heightIndex: number,
    heights: number[],
    results: Result[]
): boolean => {
    const result = results.find((r) => r.id === resultId);
    if (!result) return false;

    // If this is the first height, it's never disabled
    if (heightIndex === 0) return false;

    // Count consecutive failures across all heights
    let consecutiveFailures = 0;

    // Process all heights in order
    for (let i = 0; i < heights.length; i++) {
        const height = heights[i];
        const detail = result.details.find((d) => d.tryNumber === height);

        if (!detail || !detail.attempts || detail.attempts.length === 0) {
            continue;
        }

        for (const attempt of detail.attempts) {
            if (attempt === AttemptValue.X) {
                consecutiveFailures++;
            } else if (attempt === AttemptValue.O) {
                consecutiveFailures = 0; // Success resets failures
            }
            // PASS (-) keeps current failure count

            // Check if 3 failures reached at any point
            if (consecutiveFailures >= 3) {
                return true;
            }
        }

        // If we're at the current height index, stop processing
        if (i === heightIndex) {
            break;
        }
    }

    // Also check if athlete is retired
    return isAthleteRetired(resultId, results);
};

/**
 * Check if an athlete has already succeeded at a specific height
 */
export const hasSucceededHeight = (
    resultId: Id,
    heightValue: number,
    results: Result[]
): boolean => {
    const result = results.find((r) => r.id === resultId);
    if (!result) return false;

    // Find result detail for the given height
    const detail = result.details.find((d) => d.tryNumber === heightValue);

    // Check if the athlete has any successful attempt (O) at this height
    return detail?.attempts?.includes(AttemptValue.O) || false;
};

/**
 * Check if more attempts can be added after the last attempt value
 */
export const canAddMoreAttempts = (
    attempts: AttemptValue[] | undefined
): boolean => {
    if (!attempts || attempts.length === 0) {
        return true; // No attempts yet, can add
    }

    const lastAttempt = attempts[attempts.length - 1];

    // Cannot add after O (success), - (pass), or r (retired)
    return !(
        lastAttempt === AttemptValue.O ||
        lastAttempt === AttemptValue.PASS ||
        lastAttempt === AttemptValue.R
    );
};

