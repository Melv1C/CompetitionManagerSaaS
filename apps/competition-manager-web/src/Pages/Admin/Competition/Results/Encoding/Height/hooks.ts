import { upsertResults } from '@/api';
import { competitionAtom, resultsAtom } from '@/GlobalsStates';
import {
    AttemptValue,
    CreateResult$,
    Id,
    Result,
    ResultDetail$,
} from '@competition-manager/schemas';
import { useAtomValue } from 'jotai';
import { useEffect, useMemo, useState } from 'react';
import { useMutation } from 'react-query';
import { CurrentInputState } from './types';
import {
    hasSucceededHeight,
    isAthleteRetired,
    isHeightDisabled,
} from './utils';

export const useHeightResults = (eventId: number) => {
    const competition = useAtomValue(competitionAtom);
    if (!competition) throw new Error('No competition data found');

    const upsertResultsMutation = useMutation({
        mutationFn: upsertResults,
        onError: (error) => {
            console.error('Error upserting results:', error);
        },
    });

    const baseResults = useAtomValue(resultsAtom);
    if (!baseResults) throw new Error('No results data found');

    // Filter results for this event
    const eventResults = useMemo(
        () =>
            baseResults.filter(
                (result) => result.competitionEvent.id === eventId
            ),
        [baseResults, eventId]
    );

    // State management
    const [results, setResults] = useState<Result[]>([]);
    const [heights, setHeights] = useState<number[]>([]);
    const [showVirtualKeyboard, setShowVirtualKeyboard] = useState(false);
    const [currentInput, setCurrentInput] = useState<CurrentInputState>({
        resultId: 0 as Id,
        height: 0,
    });

    // Initialize results and heights
    useEffect(() => {
        setResults(
            eventResults.sort((a, b) => a.initialOrder - b.initialOrder)
        );
    }, [eventResults]);

    useEffect(() => {
        // Extract all heights from the results
        const newHeights = eventResults.reduce((acc: number[], result) => {
            const resultHeights = result.details.map(
                (detail) => detail.tryNumber
            );
            // Use a Set to filter out duplicates then merge with existing heights
            const uniqueHeights = [...new Set([...acc, ...resultHeights])];
            return uniqueHeights;
        }, []);

        setHeights((prev) => {
            const uniqueHeights = [...new Set([...prev, ...newHeights])];
            return uniqueHeights.sort((a, b) => a - b);
        });
    }, [eventResults]);

    // Send updated results to server
    const sendResult = (result: Result) => {
        // Set the results state to the updated result
        setResults((prev) =>
            prev.map((r) => (r.id === result.id ? result : r))
        );

        upsertResultsMutation.mutate(
            CreateResult$.array().parse([
                {
                    ...result,
                    competitionEid: competition.eid,
                    competitionEventEid: competition.events.find(
                        (event) => event.id === eventId
                    )?.eid,
                    athleteLicense: result.athlete.license,
                },
            ])
        );
    };

    // Handle adding a new height
    const addHeight = (heightValue: number) => {
        if (!heights.includes(heightValue)) {
            const newHeights = [...heights, heightValue].sort((a, b) => a - b);
            setHeights(newHeights);
        }
    };

    return {
        competition,
        results,
        heights,
        showVirtualKeyboard,
        currentInput,
        setCurrentInput,
        setShowVirtualKeyboard,
        sendResult,
        addHeight,
    };
};

export const useNextInput = (results: Result[], heights: number[]) => {
    // Find the next available input
    const findNextInput = (
        resultId: Id,
        heightValue: number,
        updatedResult?: Result
    ): { resultId: Id; height: number } | null => {
        const resultIndex = results.findIndex((r) => r.id === resultId);
        const heightIndex = heights.findIndex((h) => h === heightValue);

        console.log(
            'Finding next input for resultId:',
            resultId,
            'heightValue:',
            heightValue
        );

        if (resultIndex === -1 || heightIndex === -1) return null;

        // Create a modified results array that includes the updated result (if provided)
        const currentResults = updatedResult
            ? results.map((r) =>
                  r.id === updatedResult.id ? updatedResult : r
              )
            : results;

        // First try to find next athlete at the same height
        for (let i = resultIndex + 1; i < currentResults.length; i++) {
            const nextResultId = currentResults[i].id;

            // Skip if athlete is retired
            if (isAthleteRetired(nextResultId, currentResults)) continue;

            // Skip if the height is disabled for this athlete (failed at previous height)
            if (
                isHeightDisabled(
                    nextResultId,
                    heightIndex,
                    heights,
                    currentResults
                )
            )
                continue;

            // Check if this athlete has already succeeded at this height
            if (hasSucceededHeight(nextResultId, heightValue, currentResults))
                continue;

            // Get the athlete's details for this height
            const nextResult = currentResults.find(
                (r) => r.id === nextResultId
            );
            const detail = nextResult?.details.find(
                (d) => d.tryNumber === heightValue
            );

            // Skip if the athlete has passed this height
            if (
                detail?.attempts?.length === 1 &&
                detail.attempts[0] === AttemptValue.PASS
            ) {
                continue;
            }

            // If the athlete already has 3 attempts, skip
            if (detail?.attempts?.length === 3) {
                continue;
            }

            return { resultId: nextResultId, height: heightValue };
        }

        // Loop back to first athlete for the same height
        for (let i = 0; i <= resultIndex; i++) {
            const nextResultId = currentResults[i].id;

            // Skip if athlete is retired
            if (isAthleteRetired(nextResultId, currentResults)) continue;

            // Skip if the height is disabled for this athlete
            if (
                isHeightDisabled(
                    nextResultId,
                    heightIndex,
                    heights,
                    currentResults
                )
            )
                continue;

            // Skip if athlete has already succeeded at this height
            if (hasSucceededHeight(nextResultId, heightValue, currentResults))
                continue;

            // Check if this athlete has already passed this height
            const nextResult = currentResults.find(
                (r) => r.id === nextResultId
            );
            const detail = nextResult?.details.find(
                (d) => d.tryNumber === heightValue
            );

            // Skip if the athlete has already passed this height
            if (
                detail?.attempts?.length === 1 &&
                detail.attempts[0] === AttemptValue.PASS
            ) {
                continue;
            }

            // If the athlete already has 3 attempts, skip
            if (detail?.attempts?.length === 3) {
                continue;
            }

            return { resultId: nextResultId, height: heightValue };
        }

        // If no next athlete at current height, try first athlete at next height
        if (heightIndex < heights.length - 1) {
            const nextHeight = heights[heightIndex + 1];

            // Try all athletes at the next height
            for (let i = 0; i < currentResults.length; i++) {
                const nextResultId = currentResults[i].id;

                // Skip if athlete is retired
                if (isAthleteRetired(nextResultId, currentResults)) continue;

                // Skip if the height is disabled for this athlete
                if (
                    isHeightDisabled(
                        nextResultId,
                        heightIndex + 1,
                        heights,
                        currentResults
                    )
                )
                    continue;

                // Skip if athlete has already succeeded at this next height
                if (
                    hasSucceededHeight(nextResultId, nextHeight, currentResults)
                )
                    continue;

                // Check if this athlete has already passed this height
                const nextResult = currentResults[i];
                const detail = nextResult?.details.find(
                    (d) => d.tryNumber === nextHeight
                );

                // Skip if the athlete has already passed this height
                if (
                    detail?.attempts?.length === 1 &&
                    detail.attempts[0] === AttemptValue.PASS
                ) {
                    continue;
                }

                // If the athlete already has 3 attempts, skip
                if (detail?.attempts?.length === 3) {
                    continue;
                }

                return { resultId: nextResultId, height: nextHeight };
            }
        }

        // If we've checked all athletes at all heights, return to the first available input
        for (let h = 0; h < heights.length; h++) {
            const currentHeight = heights[h];

            for (let i = 0; i < currentResults.length; i++) {
                const candidateId = currentResults[i].id;

                // Skip if athlete is retired
                if (isAthleteRetired(candidateId, currentResults)) continue;

                // Skip if the height is disabled
                if (isHeightDisabled(candidateId, h, heights, currentResults))
                    continue;

                // Skip if athlete has already succeeded
                if (
                    hasSucceededHeight(
                        candidateId,
                        currentHeight,
                        currentResults
                    )
                )
                    continue;

                // Check if this athlete has already completed attempts for this height
                const candidate = currentResults[i];
                const detail = candidate?.details.find(
                    (d) => d.tryNumber === currentHeight
                );

                // Skip if passed or already has 3 attempts
                if (
                    (detail?.attempts?.length === 1 &&
                        detail.attempts[0] === AttemptValue.PASS) ||
                    detail?.attempts?.length === 3
                ) {
                    continue;
                }

                return { resultId: candidateId, height: currentHeight };
            }
        }

        // If no valid input found, return null
        return null;
    };

    return { findNextInput };
};

export const useInputHandling = (
    results: Result[],
    heights: number[],
    currentInput: CurrentInputState,
    setCurrentInput: (input: CurrentInputState) => void,
    setShowVirtualKeyboard: (show: boolean) => void,
    sendResult: (result: Result) => void,
    findNextInput: (
        resultId: Id,
        heightValue: number,
        updatedResult?: Result
    ) => { resultId: Id; height: number } | null
) => {
    // Focus handler for inputs
    const handleInputFocus = (resultId: Id, height: number) => {
        setShowVirtualKeyboard(true);
        setCurrentInput({ resultId, height });
    };

    // Handle input change
    const handleInputChange = (value: string) => {
        console.log('Input value changed:', value);
        const { resultId, height } = currentInput;
        const result = results.find((r) => r.id === resultId);
        if (!result) return;

        // Find or create result detail
        const resultDetail = result.details.find((d) => d.tryNumber === height);

        // Get the current number of attempts before any changes
        const previousAttemptsCount = resultDetail?.attempts?.length || 0;

        // Format value to valid attempt values
        const validAttempts = value
            .split('')
            .filter(
                (char) =>
                    char === AttemptValue.X ||
                    char === AttemptValue.O ||
                    char === AttemptValue.PASS ||
                    char === AttemptValue.R
            )
            .slice(0, 3) as AttemptValue[];

        console.log('Valid attempts:', validAttempts);

        // Check if we're adding a new attempt or just modifying existing ones
        const isAddingNew = validAttempts.length > previousAttemptsCount;

        // Check if previous attempts prevent adding more
        if (
            isAddingNew &&
            resultDetail?.attempts &&
            resultDetail.attempts.length > 0
        ) {
            const lastAttempt =
                resultDetail.attempts[resultDetail.attempts.length - 1];
            if (
                lastAttempt === AttemptValue.O ||
                lastAttempt === AttemptValue.PASS ||
                lastAttempt === AttemptValue.R
            ) {
                // Don't allow adding more attempts after O, -, or r
                return;
            }
        }

        // Only move to next input if we're adding a new attempt, not removing or modifying
        const shouldMoveNext = validAttempts.length > previousAttemptsCount;

        // Check if we're entering a PASS
        const isPassingHeight =
            validAttempts.length === 1 &&
            validAttempts[0] === AttemptValue.PASS;

        // If passing height, handle previous heights
        let updatedResult = { ...result };

        if (isPassingHeight) {
            const heightIndex = heights.findIndex((h) => h === height);

            // Add PASS to all previous heights without attempts
            for (let i = 0; i < heightIndex; i++) {
                const prevHeight = heights[i];
                const prevDetail = updatedResult.details.find(
                    (d) => d.tryNumber === prevHeight
                );

                if (!prevDetail) {
                    // Create a new result detail with PASS for previous height
                    const newPrevDetail = ResultDetail$.parse({
                        id: 1, // Server will assign real ID
                        tryNumber: prevHeight,
                        value: 0,
                        attempts: [AttemptValue.PASS],
                    });
                    updatedResult.details.push(newPrevDetail);
                } else if (
                    !prevDetail.attempts ||
                    prevDetail.attempts.length === 0
                ) {
                    // Update existing result detail with no attempts
                    prevDetail.attempts = [AttemptValue.PASS];
                }
            }

            // Update the result with the filled-in passes
            sendResult(updatedResult);
        }

        if (!resultDetail) {
            // Create a new result detail
            const newDetail = ResultDetail$.parse({
                id: 1, // Server will assign real ID
                tryNumber: height,
                value: validAttempts.includes(AttemptValue.O) ? height : 0,
                attempts: validAttempts,
            });
            updatedResult.details.push(newDetail);
            sendResult(updatedResult);
        } else {
            // Update existing detail
            const updatedDetail = {
                ...resultDetail,
                attempts: validAttempts,
                value: validAttempts.includes(AttemptValue.O)
                    ? height
                    : resultDetail.value,
            };

            const updatedDetails = updatedResult.details.map((detail) =>
                detail.tryNumber === height ? updatedDetail : detail
            );

            updatedResult = { ...updatedResult, details: updatedDetails };
            sendResult(updatedResult);
        }

        // Auto-navigate based on completion criteria
        if (shouldMoveNext) {
            // Find next input using the updated result directly
            const nextInput = findNextInput(resultId, height, updatedResult);
            if (nextInput) {
                handleInputFocus(nextInput.resultId, nextInput.height);
            }
        }
    };

    // Handle saving on keyboard close
    const handleKeyboardClose = () => {
        // Don't reset currentInput when closing keyboard
        // This allows desktop keyboard input to continue working
        // We just need to close the virtual keyboard
        // Previously, this was resetting currentInput to {resultId: 0, height: 0}
        // which prevented desktop keyboard from working
    };

    const handleEnterPressed = () => {
        // Find the next input based on current input state
        const nextInput = findNextInput(
            currentInput.resultId,
            currentInput.height
        );
        if (nextInput) {
            handleInputFocus(nextInput.resultId, nextInput.height);
        } else {
            // If no next input, close the virtual keyboard
            setShowVirtualKeyboard(false);
        }
    }

    return { handleInputFocus, handleInputChange, handleKeyboardClose, handleEnterPressed };
};
