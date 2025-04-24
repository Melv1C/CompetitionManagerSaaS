import { upsertResults } from '@/api';
import { competitionAtom, resultsAtom } from '@/GlobalsStates';
import {
    CreateResult$,
    Id,
    Result,
    ResultDetail$,
    ResultDetailCode,
} from '@competition-manager/schemas';
import {
    Box,
    Paper,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
} from '@mui/material';
import { useAtomValue } from 'jotai';
import { KeyboardEvent, useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useMutation, useQueryClient } from 'react-query';
import { DistanceKeyboard } from '../components';
import { extractValueDistance, formatValueDistance } from '../utils';
import { InputResult } from './InputResult';
import { LiveOptions } from './LiveOptions';
import { CurrentInputState, EncodeProps } from './type';

export const DistanceEncode: React.FC<EncodeProps> = ({ event }) => {
    const { t } = useTranslation();
    const competition = useAtomValue(competitionAtom);
    if (!competition) throw new Error('No competition data found');

    const queryClient = useQueryClient();
    const upsertResultsMutation = useMutation({
        mutationFn: upsertResults,
        onSuccess: () => {
            // Invalidate all results for the competition
            queryClient.invalidateQueries(['results', competition.eid]);
        },
        onError: (error) => {
            console.error('Error upserting results:', error);
        },
    });

    const handleBlur = (resultId: Id) => {
        upsertResultsMutation.mutate(
            CreateResult$.array().parse(
                results
                    .filter((result) => result.id === resultId)
                    .map((result) => ({
                        ...result,
                        competitionEid: competition.eid,
                        competitionEventEid: event.eid,
                        athleteLicense: result.athlete.license,
                    }))
            )
        );
    };

    const baseResults = useAtomValue(resultsAtom);
    if (!baseResults) throw new Error('No results data found');
    const eventResults = useMemo(
        () =>
            baseResults.filter(
                (result) => result.competitionEvent.id === event.id
            ),
        [baseResults, event.id]
    );

    const [nbTry, setNbTry] = useState(6);
    const [showVirtualKeyboard, setShowVirtualKeyboard] = useState(false);
    const [inputMode, setInputMode] = useState<'value' | 'wind' | 'both'>(
        'value'
    );
    const [currentInput, setCurrentInput] = useState<CurrentInputState>({
        resultId: 0,
        tryNumber: 0,
        type: 'value',
        value: '',
    });
    const [results, setResults] = useState<Result[]>([]);

    useEffect(() => {
        setResults(
            eventResults.sort((a, b) => a.initialOrder - b.initialOrder)
        );
    }, [eventResults]);

    // Check if a try should be disabled (if R code was entered in a previous try)
    const isTryDisabled = (result: Result, tryNumber: number): boolean => {
        // Check if there is any previous try with ResultDetailCode.R (value === ResultDetailCode.R)
        return result.details.some(
            (detail) =>
                detail.tryNumber < tryNumber &&
                detail.value === ResultDetailCode.R
        );
    };

    // Finds the next available non-disabled input
    const findNextAvailableInput = (
        currentResultId: Id,
        currentTryNumber: number,
        inputType: 'value' | 'wind' = 'value'
    ): { resultId: Id; tryNumber: number } | null => {
        let rowIndex = results.findIndex(
            (result) => result.id === currentResultId
        );
        let tryNumber = currentTryNumber;

        // If in both mode and we're on a value input, try the wind input first
        if (inputMode === 'both' && inputType === 'value') {
            return { resultId: currentResultId, tryNumber };
        }

        rowIndex++;
        if (rowIndex >= results.length) {
            rowIndex = 0;
            tryNumber++;
            if (tryNumber >= nbTry) {
                return null; // No more inputs available
            }
        }

        // Look through all remaining rows and tries
        let startRowIndex = rowIndex;
        let startTryNumber = tryNumber;

        while (true) {
            // Check if this input is enabled
            const result = results[rowIndex];
            const isDisabled = isTryDisabled(result, tryNumber);

            if (!isDisabled) {
                return { resultId: result.id, tryNumber };
            }

            // Move to next athlete
            rowIndex++;

            // If we've checked all athletes in this try, move to next try
            if (rowIndex >= results.length) {
                rowIndex = 0;
                tryNumber++;

                // If we've checked all tries, we're done
                if (tryNumber >= nbTry) {
                    // If we started mid-table, wrap around to the beginning
                    if (startTryNumber > 0 || startRowIndex > 0) {
                        tryNumber = 0;
                        rowIndex = 0;

                        // If we've wrapped all the way around to our starting point, no available inputs
                        if (startTryNumber === 0 && startRowIndex === 0) {
                            return null;
                        }
                    } else {
                        return null;
                    }
                }
            }

            // If we've gone in a full loop and found nothing, exit
            if (rowIndex === startRowIndex && tryNumber === startTryNumber) {
                return null;
            }
        }
    };

    // Handle key press to move to next cell
    const handleKeyPress = (
        event: KeyboardEvent<HTMLInputElement>,
        resultId: Id,
        tryNumber: number
    ) => {
        if (event.key === 'Enter') {
            console.log('Enter key pressed', event.key);
            event.preventDefault();

            // If in "both" mode, move to the wind input for the same try
            if (inputMode === 'both') {
                const windCellId = `wind-${resultId}-${tryNumber}`;
                const windElement = document.getElementById(windCellId);
                windElement?.focus();
                return;
            }

            // Find next available non-disabled input
            const nextInput = findNextAvailableInput(resultId, tryNumber);
            console.log('Next input:', nextInput);
            if (nextInput) {
                const nextCellId = `result-${nextInput.resultId}-${nextInput.tryNumber}`;
                const nextElement = document.getElementById(nextCellId);
                nextElement?.focus();
            }
        }
    };

    // Handle key press to move between wind inputs
    const handleWindKeyPress = (
        event: KeyboardEvent<HTMLInputElement>,
        resultId: Id,
        tryNumber: number
    ) => {
        if (event.key === 'Enter') {
            event.preventDefault();

            // Find next available non-disabled input
            const nextInput = findNextAvailableInput(
                resultId,
                tryNumber,
                'wind'
            );
            if (nextInput) {
                const nextCellId =
                    inputMode === 'both'
                        ? `result-${nextInput.resultId}-${nextInput.tryNumber}`
                        : `wind-${nextInput.resultId}-${nextInput.tryNumber}`;
                const nextElement = document.getElementById(nextCellId);
                nextElement?.focus();
            }
        }
    };

    // Add this to ensure consistent styling
    const commonCellStyles = {
        padding: '6px 16px', // Match MUI default padding or adjust as needed
        boxSizing: 'border-box' as 'border-box',
        textAlign: 'center',
    };

    // Calculate row height based on whether wind input is shown
    const getRowHeight = () => {
        return inputMode == 'both' ? '85px' : '56px'; // Increased height when wind input is shown
    };

    const commonTableStyles = {
        borderCollapse: 'separate',
        borderSpacing: 0,
        tableLayout: 'fixed' as 'fixed',
        display: 'block',
    };

    // Focus handler for inputs
    const handleInputFocus = (
        resultId: Id,
        tryNumber: number,
        type: 'value' | 'wind'
    ) => {
        setShowVirtualKeyboard(true);
        setCurrentInput({
            resultId,
            tryNumber,
            type,
            value: formatValueDistance(
                results
                    .find((result) => result.id === resultId)
                    ?.details.find(
                        (detail) => detail.tryNumber === tryNumber
                    )?.[type] || undefined
            ),
        });
    };

    // Handle virtual keyboard input
    const handleChange = (value: string) => {
        const extractedValue = extractValueDistance(value);

        setCurrentInput((prev) => ({ ...prev, value }));

        const { resultId, tryNumber, type } = currentInput;
        const result = results.find((result) => result.id === resultId);
        if (!result) return;
        if (!extractedValue) {
            const updatedDetails = result.details.filter(
                (detail) => detail.tryNumber !== tryNumber
            );
            const updatedResult = { ...result, details: updatedDetails };
            setResults((prevResults) =>
                prevResults.map((res) =>
                    res.id === resultId ? updatedResult : res
                )
            );
            return;
        }

        const resultDetail = result.details.find(
            (detail) => detail.tryNumber === tryNumber
        );

        if (!resultDetail) {
            // Create a new result detail if it doesn't exist
            const newDetail = ResultDetail$.parse({
                id: 1,
                tryNumber,
                value: type === 'value' ? extractedValue : 0,
                wind: type === 'wind' ? extractedValue : undefined,
            });
            newDetail.id = 0;
            const updatedDetails = [...result.details, newDetail];
            const updatedResult = { ...result, details: updatedDetails };
            setResults((prevResults) =>
                prevResults.map((res) =>
                    res.id === resultId ? updatedResult : res
                )
            );
        } else {
            // Update the existing result detail
            const updatedDetail = {
                ...resultDetail,
                [type]: extractedValue,
            };
            const updatedDetails = result.details.map((detail) =>
                detail.tryNumber === tryNumber ? updatedDetail : detail
            );
            const updatedResult = { ...result, details: updatedDetails };
            setResults((prevResults) =>
                prevResults.map((res) =>
                    res.id === resultId ? updatedResult : res
                )
            );
        }
    };

    return (
        <Box sx={{ display: 'flex', flexDirection: 'column' }}>
            <LiveOptions
                setNbTry={setNbTry}
                inputMode={inputMode}
                setInputMode={setInputMode}
            />

            <Box
                sx={{
                    display: 'flex',
                    width: '100%',
                    overflow: 'hidden',
                    position: 'relative',
                    justifyContent: 'center',
                }}
            >
                {/* Fixed columns (Name and Bib) */}
                <TableContainer
                    component={Paper}
                    sx={{
                        width: '300px',
                        zIndex: 2,
                        boxShadow: '5px 0 5px -2px rgba(0,0,0,0.1)',
                    }}
                >
                    <Table stickyHeader sx={commonTableStyles}>
                        <TableHead>
                            <TableRow>
                                <TableCell
                                    sx={{
                                        ...commonCellStyles,
                                        width: '40%',
                                        textAlign: 'left',
                                        height: '56px',
                                    }}
                                >
                                    {t('First Name')}
                                </TableCell>
                                <TableCell
                                    sx={{
                                        ...commonCellStyles,
                                        width: '40%',
                                        textAlign: 'left',
                                    }}
                                >
                                    {t('Last Name')}
                                </TableCell>
                                <TableCell
                                    sx={{
                                        ...commonCellStyles,
                                        width: '20%',
                                        textAlign: 'left',
                                    }}
                                >
                                    {t('Bib')}
                                </TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {results.map((result, rowIndex) => (
                                <TableRow
                                    key={`fixed-${result.id || rowIndex}`}
                                >
                                    <TableCell
                                        sx={{
                                            ...commonCellStyles,
                                            textAlign: 'left',
                                            height: getRowHeight(),
                                        }}
                                    >
                                        {result.athlete.firstName}
                                    </TableCell>
                                    <TableCell
                                        sx={{
                                            ...commonCellStyles,
                                            textAlign: 'left',
                                            height: getRowHeight(),
                                        }}
                                    >
                                        {result.athlete.lastName}
                                    </TableCell>
                                    <TableCell
                                        sx={{
                                            ...commonCellStyles,
                                            textAlign: 'left',
                                            height: getRowHeight(),
                                        }}
                                    >
                                        {result.bib}
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </TableContainer>

                {/* Scrollable columns (Tries) */}
                <TableContainer
                    component={Paper}
                    sx={{
                        maxWidth: 'calc(100% - 300px)',
                        overflowX: 'auto',
                        overflowY: 'hidden',
                        marginLeft: '0px',
                        width: 'auto',
                    }}
                >
                    <Table stickyHeader sx={commonTableStyles}>
                        <TableHead>
                            <TableRow>
                                {Array.from(
                                    { length: nbTry },
                                    (_, index) => index + 1
                                ).map((tryNum) => (
                                    <TableCell
                                        key={`head-${tryNum}`}
                                        sx={{
                                            ...commonCellStyles,
                                            width: '100px',
                                            height: '56px',
                                        }}
                                    >
                                        {t('Try')} {tryNum}
                                    </TableCell>
                                ))}
                                <TableCell
                                    key="head-best-perf"
                                    sx={{
                                        ...commonCellStyles,
                                        width: '120px',
                                        fontWeight: 'bold',
                                        backgroundColor: '#f5f5f5',
                                        height: '56px',
                                        whiteSpace: 'nowrap',
                                    }}
                                >
                                    {t('Best Perf')}
                                </TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {results.map((result, rowIndex) => (
                                <TableRow
                                    key={`scroll-${result.id || rowIndex}`}
                                >
                                    {Array.from(
                                        { length: nbTry },
                                        (_, index) => index
                                    ).map((tryIndex) => {
                                        const isDisabled = isTryDisabled(
                                            result,
                                            tryIndex
                                        );
                                        return (
                                            <TableCell
                                                key={tryIndex}
                                                sx={{
                                                    ...commonCellStyles,
                                                    width: '100px',
                                                    padding:
                                                        inputMode === 'both'
                                                            ? '6px 16px 0 16px'
                                                            : '6px 16px', // Adjust padding when wind input is shown
                                                    height: getRowHeight(),
                                                }}
                                            >
                                                <InputResult
                                                    resultId={result.id}
                                                    tryNumber={tryIndex}
                                                    resultDetail={result.details.find(
                                                        (detail) =>
                                                            detail.tryNumber ===
                                                            tryIndex
                                                    )}
                                                    inputMode={inputMode}
                                                    handleChange={handleChange}
                                                    handleKeyPress={
                                                        handleKeyPress
                                                    }
                                                    handleInputFocus={
                                                        handleInputFocus
                                                    }
                                                    handleWindKeyPress={
                                                        handleWindKeyPress
                                                    }
                                                    currentInput={currentInput}
                                                    handleBlur={handleBlur}
                                                    isDisabled={isDisabled}
                                                />
                                            </TableCell>
                                        );
                                    })}
                                    {/* Best Performance Column */}
                                    <TableCell
                                        key="best-perf"
                                        sx={{
                                            ...commonCellStyles,
                                            width: '120px',
                                            fontWeight: 'bold',
                                            backgroundColor: '#f5f5f5',
                                            height: getRowHeight(),
                                        }}
                                    >
                                        {result.details.length > 0 ? (
                                            <>
                                                {formatValueDistance(
                                                    result.value
                                                        ? result.value
                                                        : 0
                                                )}
                                            </>
                                        ) : (
                                            '-'
                                        )}
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </TableContainer>
            </Box>
            <DistanceKeyboard
                open={showVirtualKeyboard}
                setOpen={setShowVirtualKeyboard}
                inputValue={currentInput.value}
                onKeyboardInput={handleChange}
            />
        </Box>
    );
};
