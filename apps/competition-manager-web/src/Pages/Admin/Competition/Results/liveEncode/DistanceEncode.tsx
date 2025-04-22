import { upsertResults } from '@/api';
import { competitionAtom, resultsAtom } from '@/GlobalsStates';
import {
    CreateResult$,
    Id,
    Result,
    ResultDetail$,
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
import { InputResult } from './InputResult';
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
        console.log('Blur event triggered for resultId:', resultId);
        upsertResultsMutation.mutate(
            CreateResult$.array().parse(
                results.filter((result) => result.id === resultId).map((result) => ({
                    ...result,
                    competitionEid: competition.eid,
                    competitionEventEid: event.eid,
                    athleteLicense: result.athlete.license
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
    const [results, setResults] = useState<Result[]>(eventResults);

    useEffect(() => {
        console.log(results);
        setResults(eventResults);
    }, [eventResults]);

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
            const rowIndex = results.findIndex(
                (result) => result.id === resultId
            );
            // Move to next athlete in the same try column
            const nextRowIndex = rowIndex + 1;

            // If there are more athlete for this try
            if (nextRowIndex < results.length) {
                const nextResultId = results[nextRowIndex].id;
                const nextCellId = `result-${nextResultId}-${tryNumber}`;
                const nextElement = document.getElementById(nextCellId);
                nextElement?.focus();
            }
            // If we're at the last athlete for this try, move to the first athlete of the next try
            else if (tryNumber < nbTry - 1) {
                const nextTryIndex = tryNumber + 1;
                const firstResultId = results[0].id;
                const nextCellId = `result-${firstResultId}-${nextTryIndex}`;
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
            const rowIndex = results.findIndex(
                (result) => result.id === resultId
            );

            // If in "both" mode, move to the next athlete's performance input
            if (inputMode === 'both') {
                // Move to next athlete in the same try column
                const nextRowIndex = rowIndex + 1;

                // If there are more athlete for this try
                if (nextRowIndex < results.length) {
                    const nextResultId = results[nextRowIndex].id;
                    const nextCellId = `result-${nextResultId}-${tryNumber}`;
                    const nextElement = document.getElementById(nextCellId);
                    nextElement?.focus();
                }
                // If we're at the last athlete for this try, move to the first athlete of the next try
                else if (tryNumber < nbTry - 1) {
                    const nextTryIndex = tryNumber + 1;
                    const firstResultId = results[0].id;
                    const nextCellId = `result-${firstResultId}-${nextTryIndex}`;
                    const nextElement = document.getElementById(nextCellId);
                    nextElement?.focus();
                }
                return;
            }

            // Move to next athlete in the same try column
            const nextRowIndex = rowIndex + 1;

            // If there are more athlete for this try
            if (nextRowIndex < results.length) {
                const nextResultId = results[nextRowIndex].id;
                const nextCellId = `wind-${nextResultId}-${tryNumber}`;
                const nextElement = document.getElementById(nextCellId);
                nextElement?.focus();
            }
            // If we're at the last result for this try, move to the first result of the next try
            else if (tryNumber < nbTry - 1) {
                const nextTryIndex = tryNumber + 1;
                const firstResultId = results[0].id;
                const nextCellId = `wind-${firstResultId}-${nextTryIndex}`;
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
            value:
                results
                    .find((result) => result.id === resultId)
                    ?.details[tryNumber]?.[type]?.toString() || '',
        });
    };

    // Handle virtual keyboard input
    const handleChange = (value: string) => {
        console.log('Keyboard input:', value);
        setCurrentInput((prev) => ({ ...prev, value }));

        const { resultId, tryNumber, type } = currentInput;
        const result = results.find((result) => result.id === resultId);
        if (!result) return;

        const resultDetail = result.details.find(
            (detail) => detail.tryNumber === tryNumber
        );

        if (!resultDetail) {
            // Create a new result detail if it doesn't exist
            const newDetail = ResultDetail$.parse({
                id: 1,
                tryNumber,
                value: type === 'value' ? parseFloat(value) : 0,
                wind: type === 'wind' ? parseFloat(value) : undefined,
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
                [type]: parseFloat(value),
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
            {/* <LiveOptions 
                setNbTry={setNbTry} 
                updateResultsForNewTryCount={updateResultsForNewTryCount} 
                inputMode={inputMode} 
                setInputMode={setInputMode}
            /> */}

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
                                    ).map((tryIndex) => (
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
                                                handleKeyPress={handleKeyPress}
                                                handleInputFocus={
                                                    handleInputFocus
                                                }
                                                handleWindKeyPress={
                                                    handleWindKeyPress
                                                }
                                                currentInput={currentInput}
                                                handleBlur={handleBlur}
                                            />
                                        </TableCell>
                                    ))}
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
                                        -
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
