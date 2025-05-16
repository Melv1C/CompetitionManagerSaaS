import { upsertResults } from '@/api';
import { competitionAtom, resultsAtom } from '@/GlobalsStates';
import {
    CompetitionEvent,
    Eid,
    Id,
    Result,
    ResultDetail$,
    ResultDetailCode,
    UpsertResult,
    UpsertResult$,
    UpsertResultType,
} from '@competition-manager/schemas';
import { formatResult, sortResult } from '@competition-manager/utils';
import { faMinus, faPlus } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
    Box,
    Button,
    Paper,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Typography,
} from '@mui/material';
import { useAtomValue } from 'jotai';
import { useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useMutation } from 'react-query';
import { ParticipantsSelector } from '../components/ParticipantsSelector';
import { DistanceKeyboard } from './DistanceKeyboard';
import { InputResultDistance } from './InputResultDistance';

interface DistanceEncodeProps {
    event: CompetitionEvent;
}

export const DistanceEncode: React.FC<DistanceEncodeProps> = ({ event }) => {
    const { t } = useTranslation();
    const competition = useAtomValue(competitionAtom);
    if (!competition) throw new Error('No competition data found');

    const upsertResultsMutation = useMutation({
        mutationFn: (params: {
            competitionEid: Eid;
            type: UpsertResultType;
            results: UpsertResult[];
        }) => upsertResults(params.competitionEid, params.type, params.results),
        onError: (error) => {
            console.error('Error upserting results:', error);
        },
    });

    const baseResults = useAtomValue(resultsAtom);
    if (!baseResults) throw new Error('No results data found');

    const eventResults = useMemo(
        () =>
            baseResults.filter(
                (result) => result.competitionEvent.id === event.id
            ),
        [baseResults, event.id]
    );

    const [results, setResults] = useState<Result[]>([]);
    const [showVirtualKeyboard, setShowVirtualKeyboard] = useState(false);
    const [currentInput, setCurrentInput] = useState({
        resultId: 0,
        tryNumber: 0,
        value: '',
    });

    const [nbOfAttempts, setNbOfAttempts] = useState(3);

    const MIN_BASE_ATTEMPTS = 2;
    const MAX_ATTEMPTS = 6;

    // Calculate the minimum number of attempts based on existing result details
    const getMinAttempts = (): number => {
        if (results.length === 0) return MIN_BASE_ATTEMPTS;

        // Find the maximum tryNumber in all result details
        const maxExistingAttempt = Math.max(
            ...results.flatMap((result) =>
                result.details.map((detail) => detail.tryNumber)
            ),
            0 // Default if no details exist
        );

        // Minimum attempts is the higher of MIN_BASE_ATTEMPTS or maxExistingAttempt
        return Math.max(MIN_BASE_ATTEMPTS, maxExistingAttempt);
    };

    // Effect to set initial number of attempts based on existing data
    useEffect(() => {
        const minAttempts = getMinAttempts();
        setNbOfAttempts((prevAttempts) => Math.max(prevAttempts, minAttempts));
    }, [results]);

    const handleIncreaseAttempts = () => {
        if (nbOfAttempts < MAX_ATTEMPTS) {
            setNbOfAttempts(nbOfAttempts + 1);
        }
    };

    const handleDecreaseAttempts = () => {
        const minAttempts = getMinAttempts();
        if (nbOfAttempts > minAttempts) {
            setNbOfAttempts(nbOfAttempts - 1);
        }
    };

    useEffect(() => {
        setResults(eventResults.sort((a, b) => a.tempOrder - b.tempOrder));
    }, [eventResults]);

    const sendResult = (result: Result) => {
        upsertResultsMutation.mutate({
            competitionEid: competition.eid,
            type: UpsertResultType.LIVE,
            results: UpsertResult$.array().parse([
                {
                    ...result,
                    competitionEventEid: event.eid,
                    athleteLicense: result.athlete.license,
                },
            ]),
        });
    };

    // Check if athlete is retired (has 'r' in any previous attempt)
    const isAthleteRetired = (
        resultId: Id,
        currentTryNumber: number
    ): boolean => {
        const result = results.find((r) => r.id === resultId);
        if (!result) return false;

        // Check if any previous attempt has ResultDetailCode.R
        return result.details.some(
            (detail) =>
                detail.tryNumber < currentTryNumber &&
                detail.value === ResultDetailCode.R
        );
    };

    // Handle opening the keyboard for input
    const handleInputFocus = (resultId: Id, tryNumber: number) => {
        // Don't open keyboard if athlete is retired for this attempt
        if (isAthleteRetired(resultId, tryNumber)) {
            return;
        }

        // Show the virtual keyboard
        setShowVirtualKeyboard(true);

        const result = results.find((r) => r.id === resultId);
        if (!result) return;

        const detail = result.details.find((d) => d.tryNumber === tryNumber);

        setCurrentInput({
            resultId,
            tryNumber,
            value: detail?.value?.toString() || '',
        });
    };

    // Find the next available input field
    const findNextInput = (currentResultId: Id, currentTryNumber: number) => {
        let resultIndex = results.findIndex((r) => r.id === currentResultId);
        let tryNumber = currentTryNumber;
        let nextResultId;
        let foundValidInput = false;
        let loopCount = 0;
        const maxLoops = results.length * nbOfAttempts; // Safety to prevent infinite loops

        // Keep searching until we find a valid input or have checked all possibilities
        while (!foundValidInput && loopCount < maxLoops) {
            loopCount++;

            // Try next athlete in same attempt
            resultIndex++;

            // If we've reached the end of the athletes, go to the next attempt
            if (resultIndex >= results.length) {
                resultIndex = 0;
                tryNumber++;

                // If we've reached the end of attempts, go back to the first athlete and attempt
                if (tryNumber > nbOfAttempts) {
                    resultIndex = 0;
                    tryNumber = 1;
                }
            }

            nextResultId = results[resultIndex]?.id || 0;

            // Check if this is a valid input (not disabled due to retirement)
            if (nextResultId && !isAthleteRetired(nextResultId, tryNumber)) {
                foundValidInput = true;
            }
        }

        // If we couldn't find a valid input, return the original next input
        if (!foundValidInput) {
            resultIndex =
                results.findIndex((r) => r.id === currentResultId) + 1;
            if (resultIndex >= results.length) {
                resultIndex = 0;
                tryNumber = currentTryNumber + 1;
                if (tryNumber > nbOfAttempts) {
                    tryNumber = 1;
                }
            }
        }

        return {
            resultId: results[resultIndex]?.id || 0,
            tryNumber,
        };
    };

    // Move to the next input after Enter key is pressed
    const moveToNextInput = () => {
        const { resultId, tryNumber } = currentInput;

        // Find next input
        const nextInput = findNextInput(resultId, tryNumber);

        // Update current input and focus it
        if (nextInput.resultId) {
            // Focus the next input element
            setTimeout(() => {
                const nextInputId = `distance-result-${nextInput.resultId}-${nextInput.tryNumber}`;
                const nextInputElement = document.getElementById(nextInputId);

                if (nextInputElement) {
                    handleInputFocus(nextInput.resultId, nextInput.tryNumber);
                    nextInputElement.focus();
                }
            }, 0);
        }
    };

    // Handle virtual keyboard input for distance - only update the current input value
    const handleInputChange = (value: string) => {
        setCurrentInput((prev) => ({ ...prev, value }));
    };

    // Handle blur events - now contains all the logic for updating and saving results
    const handleInputBlur = () => {
        console.log('Input blurred:', currentInput);
        const { resultId, tryNumber, value } = currentInput;
        if (!resultId || !tryNumber) return; // Skip if no valid input

        const result = results.find((r) => r.id === resultId);
        if (!result) return;

        const resultDetail = result.details.find(
            (d) => d.tryNumber === tryNumber
        );

        // Handle special result codes
        let resultValue: number;

        if (value.trim() === 'X') {
            resultValue = ResultDetailCode.X;
        } else if (value.trim() === '-') {
            resultValue = ResultDetailCode.PASS;
        } else if (value.trim() === 'r') {
            resultValue = ResultDetailCode.R;
        } else {
            // Regular numeric value
            resultValue = parseFloat(value);

            // If parsing failed, send a default value (e.g., 0)
            if (isNaN(resultValue)) {
                resultValue = 0; // or any other default value you prefer
            }
        }
        let updatedResult: Result;

        if (!resultDetail) {
            // Create a new result detail if it doesn't exist
            const newDetail = ResultDetail$.parse({
                id: 1, // Temporary ID, will be replaced by backend
                tryNumber,
                value: resultValue,
            });

            // Create updated result with new detail
            updatedResult = {
                ...result,
                details: [...result.details, newDetail],
            };
        } else {
            // Update the existing result detail
            const updatedDetail = {
                ...resultDetail,
                value: resultValue,
            };

            const updatedDetails = result.details.map((detail) =>
                detail.tryNumber === tryNumber ? updatedDetail : detail
            );

            // Create updated result with updated detail
            updatedResult = { ...result, details: updatedDetails };
        }

        // Update temporary results state, so the UI reflects the changes immediately
        // The backend will send the updated result with the correct ID
        setResults((prevResults) =>
            prevResults.map((r) =>
                r.id === updatedResult.id ? updatedResult : r
            )
        );

        // Send to backend when user leaves input
        sendResult(updatedResult);
    };

    const handleKeyboardClose = () => {
        setShowVirtualKeyboard(false);
        setCurrentInput({
            resultId: 0,
            tryNumber: 0,
            value: '',
        });
    };

    // Use useMemo to avoid recalculations on every render
    const places = useMemo(() => {
        const resultPlaces = new Map();

        // Only calculate places for results that have a valid value
        const validResults = results.filter(
            (result) => result.value !== null && result.value !== undefined
        );

        validResults.forEach((result) => {
            // Count results that are better than the current one
            const betterResults = validResults.filter(
                (other) => sortResult(other, result) < 0
            );

            // Place is 1 + number of better results
            const place = betterResults.length + 1;
            resultPlaces.set(result.id, place);
        });

        return resultPlaces;
    }, [results]); // Only recalculate when results change

    // If no results are available yet, show the participants selector
    if (results.length === 0) {
        return (
            <ParticipantsSelector
                event={event}
                onResultsCreated={() => {}} // This will trigger a refetch via React Query
            />
        );
    }

    return (
        <Box sx={{ display: 'flex', flexDirection: 'column' }}>
            <Box
                sx={{
                    display: 'flex',
                    justifyContent: 'flex-end',
                    mb: 2,
                    alignItems: 'center',
                    gap: 2,
                }}
            >
                <Paper
                    elevation={1}
                    sx={{
                        display: 'flex',
                        alignItems: 'center',
                        borderRadius: '20px',
                        overflow: 'hidden',
                        border: '1px solid rgba(0, 0, 0, 0.08)',
                    }}
                >
                    <Typography
                        variant="body2"
                        sx={{
                            px: 2,
                            fontWeight: 500,
                        }}
                    >
                        {t('result:attempts')}
                    </Typography>
                    <Button
                        onClick={handleDecreaseAttempts}
                        disabled={nbOfAttempts <= getMinAttempts()}
                        sx={{
                            minWidth: '40px',
                            minHeight: '40px',
                            borderRadius: 0,
                        }}
                    >
                        <FontAwesomeIcon icon={faMinus} />
                    </Button>
                    <Box
                        sx={{
                            px: 2,
                            fontWeight: 'bold',
                            color: 'primary.main',
                        }}
                    >
                        {nbOfAttempts}
                    </Box>
                    <Button
                        onClick={handleIncreaseAttempts}
                        disabled={nbOfAttempts >= MAX_ATTEMPTS}
                        sx={{
                            minWidth: '40px',
                            minHeight: '40px',
                            borderRadius: 0,
                        }}
                    >
                        <FontAwesomeIcon icon={faPlus} />
                    </Button>
                </Paper>
            </Box>
            <TableContainer component={Paper}>
                <Table stickyHeader>
                    <TableHead>
                        <TableRow>
                            <TableCell align="center" sx={{ width: '30px' }}>
                                {t('glossary:order')}
                            </TableCell>
                            <TableCell align="center" sx={{ width: '60px' }}>
                                {t('glossary:bib')}
                            </TableCell>
                            <TableCell>{t('glossary:athlete')}</TableCell>
                            <TableCell>{t('glossary:club')}</TableCell>
                            {Array.from({ length: nbOfAttempts }).map(
                                (_, i) => (
                                    <TableCell
                                        key={`attempt-${i + 1}`}
                                        align="center"
                                    >
                                        {t('result:attempt', { number: i + 1 })}
                                    </TableCell>
                                )
                            )}
                            <TableCell align="center" sx={{ width: '30px' }}>
                                {t('glossary:place')}
                            </TableCell>
                            <TableCell align="center" sx={{ width: '80px' }}>
                                {t('glossary:best')}
                            </TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {results.map((result) => {
                            // Get the calculated place from our map, or show '-' if no valid result
                            const currentPlace =
                                result.value !== null &&
                                result.value !== undefined
                                    ? places.get(result.id) || '-'
                                    : '-';

                            return (
                                <TableRow key={result.id}>
                                    <TableCell
                                        align="center"
                                        sx={{ width: '30px' }}
                                    >
                                        {result.initialOrder}
                                    </TableCell>
                                    <TableCell
                                        align="center"
                                        sx={{ width: '60px' }}
                                    >
                                        {result.bib}
                                    </TableCell>
                                    <TableCell>
                                        {result.athlete.firstName}{' '}
                                        {result.athlete.lastName}
                                    </TableCell>
                                    <TableCell>{result.club.abbr}</TableCell>
                                    {Array.from({ length: nbOfAttempts }).map(
                                        (_, i) => {
                                            const tryNumber = i + 1;
                                            const isDisabled = isAthleteRetired(
                                                result.id,
                                                tryNumber
                                            );

                                            return (
                                                <TableCell
                                                    key={`result-${result.id}-attempt-${tryNumber}`}
                                                    align="center"
                                                >
                                                    <InputResultDistance
                                                        resultId={result.id}
                                                        tryNumber={tryNumber}
                                                        resultDetail={result.details.find(
                                                            (detail) =>
                                                                detail.tryNumber ===
                                                                tryNumber
                                                        )}
                                                        handleInputFocus={
                                                            handleInputFocus
                                                        }
                                                        currentInput={
                                                            currentInput
                                                        }
                                                        isDisabled={isDisabled}
                                                    />
                                                </TableCell>
                                            );
                                        }
                                    )}
                                    <TableCell
                                        align="center"
                                        sx={{ width: '30px' }}
                                    >
                                        {currentPlace}
                                    </TableCell>
                                    <TableCell
                                        align="center"
                                        sx={{ width: '80px' }}
                                    >
                                        {formatResult(result)}
                                    </TableCell>
                                </TableRow>
                            );
                        })}
                    </TableBody>
                </Table>
            </TableContainer>

            <DistanceKeyboard
                open={showVirtualKeyboard}
                inputValue={currentInput.value}
                onKeyboardInput={handleInputChange}
                onEnterPressed={() => {
                    handleInputBlur(); // Call the blur handler to save the input
                    moveToNextInput(); // Move to the next input after Enter key is pressed
                }}
                onClose={() => {
                    handleInputBlur(); // Call the blur handler to save the input
                    handleKeyboardClose(); // Close the keyboard
                }}
            />
        </Box>
    );
};
