import { competitionAtom, resultsAtom } from '@/GlobalsStates';
import {
    AttemptValue,
    Id,
    Result,
    ResultDetail$,
} from '@competition-manager/schemas';
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
    TextField,
} from '@mui/material';
import { useAtomValue } from 'jotai';
import { KeyboardEvent, useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { HeightKeyboard } from '../components/HeightKeyboard';
import { InputResultHeight } from './InputResultHeight';
import { EncodeProps } from './type';

const formatAttemptValue = (value: string): string => {
    // Limit to 3 characters
    if (value.length > 3) {
        value = value.slice(0, 3);
    }

    // Convert to uppercase and filter out invalid characters
    const validChars = value
        .toUpperCase()
        .split('')
        .filter((char) =>
            Object.values(AttemptValue).includes(char as AttemptValue)
        );

    // If we have a '-' or 'O', it should be the only character
    if (
        validChars.includes(AttemptValue.PASS) &&
        validChars.indexOf(AttemptValue.PASS) !== validChars.length - 1
    ) {
        validChars.splice(validChars.indexOf(AttemptValue.PASS), 1);
    }

    if (
        validChars.includes(AttemptValue.O) &&
        validChars.indexOf(AttemptValue.O) !== validChars.length - 1
    ) {
        validChars.splice(validChars.indexOf(AttemptValue.O), 1);
    }

    return validChars.join('');
};

export const HeightEncode: React.FC<EncodeProps> = ({ event }) => {
    const { t } = useTranslation();
    const competition = useAtomValue(competitionAtom);
    if (!competition) throw new Error('No competition data found');

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
    const [heights, setHeights] = useState<number[]>([]);
    const [newHeight, setNewHeight] = useState<string>('');
    const [showVirtualKeyboard, setShowVirtualKeyboard] = useState(false);
    const [currentInput, setCurrentInput] = useState({
        resultId: 0,
        height: 0,
        value: '',
    });

    useEffect(() => {
        setResults(
            eventResults.sort((a, b) => a.initialOrder - b.initialOrder)
        );
    }, [eventResults]);

    // Handle adding a new height
    const addHeight = () => {
        const heightValue = parseFloat(newHeight);
        if (isNaN(heightValue) || heightValue <= 0) return;

        if (!heights.includes(heightValue)) {
            const newHeights = [...heights, heightValue].sort((a, b) => a - b);
            setHeights(newHeights);
            setNewHeight('');
        }
    };

    // Handle new height input key press
    const handleHeightKeyPress = (event: KeyboardEvent<HTMLInputElement>) => {
        if (event.key === 'Enter') {
            event.preventDefault();
            addHeight();
        }
    };

    // Check if a height should be disabled for an athlete
    const isHeightDisabled = (resultId: Id, heightIndex: number): boolean => {
        if (heightIndex === 0) return false;

        const result = results.find((r) => r.id === resultId);
        if (!result) return false;

        // Get the previous height
        const prevHeight = heights[heightIndex - 1];

        // Find result detail for the previous height
        const prevDetail = result.details.find((d) => d.value === prevHeight);

        if (
            prevDetail?.attempts?.filter((a) => a === AttemptValue.X).length ===
            3
        ) {
            return true; // Disable this height if 3 X attempts
        }
        return isHeightDisabled(resultId, heightIndex - 1); // Check previous height
    };

    // Find the next available input
    const findNextInput = (
        resultId: Id,
        heightValue: number
    ): { resultId: Id; height: number } | null => {
        const resultIndex = results.findIndex((r) => r.id === resultId);
        const heightIndex = heights.findIndex((h) => h === heightValue);

        if (resultIndex === -1 || heightIndex === -1) return null;

        // First try to find next athlete at the same height
        for (let i = resultIndex + 1; i < results.length; i++) {
            const nextResultId = results[i].id;

            // Skip if the height is disabled for this athlete
            if (isHeightDisabled(nextResultId, heightIndex)) continue;

            // Check if this athlete has already passed this height
            const nextResult = results.find((r) => r.id === nextResultId);
            const detail = nextResult?.details.find(
                (d) => d.value === heightValue
            );

            // Skip if the athlete has already passed this height
            if (
                detail?.attempts?.length === 1 &&
                detail.attempts[0] === AttemptValue.PASS
            ) {
                continue;
            }

            return { resultId: nextResultId, height: heightValue };
        }

        // If no next athlete at current height, try first athlete at next height
        if (heightIndex < heights.length - 1) {
            const nextHeight = heights[heightIndex + 1];
            for (let i = 0; i < results.length; i++) {
                // Skip if the height is disabled for this athlete
                if (isHeightDisabled(results[i].id, heightIndex + 1)) continue;

                // Check if this athlete has already passed this height
                const nextResult = results[i];
                const detail = nextResult?.details.find(
                    (d) => d.value === nextHeight
                );

                // Skip if the athlete has already passed this height
                if (
                    detail?.attempts?.length === 1 &&
                    detail.attempts[0] === AttemptValue.PASS
                ) {
                    continue;
                }

                return { resultId: results[i].id, height: nextHeight };
            }
        }

        return null;
    };

    // Focus handler for inputs
    const handleInputFocus = (resultId: Id, height: number) => {
        setShowVirtualKeyboard(true);

        const result = results.find((r) => r.id === resultId);
        if (!result) return;

        const detail = result.details.find((d) => d.value === height);

        setCurrentInput({
            resultId,
            height,
            value: detail?.attempts?.join('') || '',
        });
    };

    // Handle virtual keyboard input
    const handleInputChange = (value: string) => {
        // Ensure value is max 3 characters and only contains valid AttemptValues
        const validValue = formatAttemptValue(value);

        setCurrentInput((prev) => ({ ...prev, value: validValue }));

        const { resultId, height } = currentInput;
        const result = results.find((r) => r.id === resultId);
        if (!result) return;

        const resultDetail = result.details.find((d) => d.value === height);

        // Check if we're entering a PASS
        const isPassingHeight = validValue == AttemptValue.PASS;

        // If passing this height, let's handle previous heights that don't have attempts
        if (isPassingHeight) {
            const heightIndex = heights.findIndex((h) => h === height);
            const updatedResult = { ...result };

            // Loop through all previous heights and add PASS if they don't have attempts
            for (let i = 0; i < heightIndex; i++) {
                const prevHeight = heights[i];
                const prevDetail = updatedResult.details.find(
                    (d) => d.value === prevHeight
                );

                if (!prevDetail) {
                    // Create a new result detail with PASS for previous height
                    const newPrevDetail = ResultDetail$.parse({
                        id: Date.now() - i, // Ensure unique temp ID
                        tryNumber: 0,
                        value: prevHeight,
                        attempts: [AttemptValue.PASS],
                        wind: null,
                        isBest: false,
                        isOfficialBest: false,
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

            // Update state with the filled-in passes
            setResults((prevResults) =>
                prevResults.map((res) =>
                    res.id === resultId ? updatedResult : res
                )
            );
        }

        if (!resultDetail) {
            // Create a new result detail if it doesn't exist
            const newDetail = ResultDetail$.parse({
                id: Date.now(), // Temporary ID
                tryNumber: 0, // Not used for height attempts
                value: height, // Store height as value
                attempts: validValue.split('') as AttemptValue[],
                wind: null,
                isBest: false,
                isOfficialBest: false,
            });

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
                attempts: validValue.split('') as AttemptValue[],
            };

            const updatedDetails = result.details.map((detail) =>
                detail.value === height ? updatedDetail : detail
            );

            const updatedResult = { ...result, details: updatedDetails };
            setResults((prevResults) =>
                prevResults.map((res) =>
                    res.id === resultId ? updatedResult : res
                )
            );
        }

        // Auto-navigate on O or PASS
        const lastChar = validValue.charAt(validValue.length - 1);
        if (
            ((lastChar === AttemptValue.O || lastChar === AttemptValue.PASS) &&
                validValue.length > 0) ||
            validValue.length === 3
        ) {
            // Find next input
            const nextInput = findNextInput(resultId, height);
            if (nextInput) {
                // Small delay to allow the UI to update
                setTimeout(() => {
                    handleInputFocus(nextInput.resultId, nextInput.height);
                }, 200);
            }
        }

        // If three X values, disable next heights for this athlete
        if (
            validValue === `${AttemptValue.X}${AttemptValue.X}${AttemptValue.X}`
        ) {
            // Nothing extra needed here since the isHeightDisabled function will handle it
        }
    };

    return (
        <Box sx={{ display: 'flex', flexDirection: 'column' }}>
            <Box sx={{ mb: 2, display: 'flex', alignItems: 'center', gap: 2 }}>
                <TextField
                    label={t('Add Height')}
                    variant="outlined"
                    size="small"
                    value={newHeight}
                    onChange={(e) => setNewHeight(e.target.value)}
                    onKeyDown={handleHeightKeyPress}
                    type="number"
                    inputProps={{ step: 0.01 }}
                    sx={{ width: '120px' }}
                />
                <Button variant="contained" onClick={addHeight}>
                    {t('Add')}
                </Button>
            </Box>

            {heights.length > 0 && (
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
                        <Table
                            stickyHeader
                            sx={{
                                borderCollapse: 'separate',
                                borderSpacing: 0,
                                tableLayout: 'fixed',
                                display: 'block',
                            }}
                        >
                            <TableHead>
                                <TableRow>
                                    <TableCell
                                        sx={{
                                            padding: '6px 16px',
                                            boxSizing: 'border-box',
                                            textAlign: 'left',
                                            width: '40%',
                                            height: '56px',
                                        }}
                                    >
                                        {t('First Name')}
                                    </TableCell>
                                    <TableCell
                                        sx={{
                                            padding: '6px 16px',
                                            boxSizing: 'border-box',
                                            textAlign: 'left',
                                            width: '40%',
                                        }}
                                    >
                                        {t('Last Name')}
                                    </TableCell>
                                    <TableCell
                                        sx={{
                                            padding: '6px 16px',
                                            boxSizing: 'border-box',
                                            textAlign: 'left',
                                            width: '20%',
                                        }}
                                    >
                                        {t('Bib')}
                                    </TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {results.map((result) => (
                                    <TableRow key={`fixed-${result.id}`}>
                                        <TableCell
                                            sx={{
                                                padding: '6px 16px',
                                                boxSizing: 'border-box',
                                                textAlign: 'left',
                                                height: '56px',
                                            }}
                                        >
                                            {result.athlete.firstName}
                                        </TableCell>
                                        <TableCell
                                            sx={{
                                                padding: '6px 16px',
                                                boxSizing: 'border-box',
                                                textAlign: 'left',
                                                height: '56px',
                                            }}
                                        >
                                            {result.athlete.lastName}
                                        </TableCell>
                                        <TableCell
                                            sx={{
                                                padding: '6px 16px',
                                                boxSizing: 'border-box',
                                                textAlign: 'left',
                                                height: '56px',
                                            }}
                                        >
                                            {result.bib}
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </TableContainer>

                    {/* Scrollable columns (Heights) */}
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
                        <Table
                            stickyHeader
                            sx={{
                                borderCollapse: 'separate',
                                borderSpacing: 0,
                                tableLayout: 'fixed',
                                display: 'block',
                            }}
                        >
                            <TableHead>
                                <TableRow>
                                    {heights.map((height) => (
                                        <TableCell
                                            key={`head-${height}`}
                                            sx={{
                                                padding: '6px 16px',
                                                boxSizing: 'border-box',
                                                textAlign: 'center',
                                                width: '100px',
                                                height: '56px',
                                            }}
                                        >
                                            {height}m
                                        </TableCell>
                                    ))}
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {results.map((result) => (
                                    <TableRow key={`scroll-${result.id}`}>
                                        {heights.map((height, heightIndex) => (
                                            <TableCell
                                                key={`cell-${result.id}-${height}`}
                                                sx={{
                                                    padding: '6px 16px',
                                                    boxSizing: 'border-box',
                                                    textAlign: 'center',
                                                    width: '100px',
                                                    height: '56px',
                                                }}
                                            >
                                                <InputResultHeight
                                                    resultId={result.id}
                                                    height={height}
                                                    resultDetail={result.details.find(
                                                        (detail) =>
                                                            detail.value ===
                                                            height
                                                    )}
                                                    handleInputFocus={
                                                        handleInputFocus
                                                    }
                                                    currentInput={currentInput}
                                                    isDisabled={isHeightDisabled(
                                                        result.id,
                                                        heightIndex
                                                    )}
                                                    onKeyboardInput={
                                                        handleInputChange
                                                    }
                                                    findNextInput={
                                                        findNextInput
                                                    }
                                                />
                                            </TableCell>
                                        ))}
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </TableContainer>
                </Box>
            )}

            <HeightKeyboard
                open={showVirtualKeyboard}
                setOpen={setShowVirtualKeyboard}
                inputValue={currentInput.value}
                onKeyboardInput={handleInputChange}
            />
        </Box>
    );
};
