import { Paper, Box } from "@mui/material";
import { useAtomValue } from "jotai";
import { useTranslation } from "react-i18next";
import { adminInscriptionsAtom, competitionAtom } from '@/GlobalsStates'
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from "@mui/material";
import { useState, KeyboardEvent } from "react";
import { HeightKeyboard } from "../components";
import { EncodeProps, ResultsData } from "./type";
import { InputResultHeight } from "./InputResultHeight";
import { AttemptValue, ResultCode } from "@competition-manager/schemas";

export const HeightEncode: React.FC<EncodeProps> = ({ event }) => {
    const { t } = useTranslation();
    const competition = useAtomValue(competitionAtom);
    if (!competition) throw new Error('No competition data found');

    const [nbTry, setNbTry] = useState(2);
    const [showVirtualKeyboard, setShowVirtualKeyboard] = useState(false);
    const [currentInputId, setCurrentInputId] = useState<string | null>(null);
    const [currentInputValue, setCurrentInputValue] = useState<string>('');
    const [currentInscriptionId, setCurrentInscriptionId] = useState<string>('');
    const [currentTryIndex, setCurrentTryIndex] = useState<number>(0);
    const [currentDigitIndex, setCurrentDigitIndex] = useState<number>(0);

    const adminInscriptions = useAtomValue(adminInscriptionsAtom);
    if (!adminInscriptions) throw new Error('No inscriptions found');
    const inscriptions = adminInscriptions.filter(inscription => inscription.competitionEvent.id === event.id);

    // State to hold all results
    const [results, setResults] = useState<ResultsData>({});

    // Handle key press to move to next cell
    const handleKeyPress = (
        event: KeyboardEvent<HTMLInputElement>,
        tryIndex: number,
        rowIndex: number,
        inscriptionId: string,
        subIndex?: number
    ) => {
        event.preventDefault();
        console.log("Key pressed:", event.key, "on input ID:", inscriptionId);
        // Find next input to focus
        let nextRowIndex = rowIndex;
        let nextTryIndex = tryIndex;
        let nextSubIndex = (subIndex !== undefined ? subIndex : 2) + 1; // Default to last position if subIndex not provided
        
        // If we're at the last digit position, move to next try or athlete
        if (nextSubIndex > 2) {
            nextSubIndex = 0; // Reset to first digit
            
            // For Enter key or end of current input group, go to next athlete or try
            if (event.key === 'Enter' || nextSubIndex > 2) {
                // Check if there are more athletes
                if (rowIndex < inscriptions.length - 1) {
                    // Move to next athlete, same try
                    nextRowIndex++;
                } else {
                    // At last athlete, move to next try/column
                    nextRowIndex = 0;
                    nextTryIndex++;
                    
                    // If we're past the last try column, wrap back to first try of first athlete
                    if (nextTryIndex >= nbTry) {
                        nextTryIndex = 0;
                    }
                }
            }
        }
        
        // Get next inscription ID
        const nextInscription = inscriptions[nextRowIndex];
        if (!nextInscription) return;
        
        // Create ID for next input and focus it
        const nextInputId = `result-${nextInscription.id}-${nextTryIndex}-${nextSubIndex + 1}`;
        const nextInput = document.getElementById(nextInputId) as HTMLInputElement;
        if (nextInput) {
            nextInput.focus();
            
            // Update current state for virtual keyboard
            setCurrentInputId(nextInputId);
            setCurrentInscriptionId(nextInscription.id.toString());
            setCurrentTryIndex(nextTryIndex);
            setCurrentDigitIndex(nextSubIndex);
            
            // Set the input value to empty to allow easy typing
            setCurrentInputValue('');
        }
    };

    // Add this to ensure consistent styling
    const commonCellStyles = {
        padding: '6px 16px',
        boxSizing: 'border-box' as 'border-box',
        textAlign: 'center'
    };

    // Calculate row height based on whether wind input is shown
    const getRowHeight = () => {
        return '56px';  // Consistent height for all rows
    };

    const commonTableStyles = {
        borderCollapse: 'separate',
        borderSpacing: 0,
        tableLayout: 'fixed' as 'fixed',
        display: 'block',
    };

    // Focus handler for inputs
    const handleInputFocus = (e: any, inputId: string) => {
        setShowVirtualKeyboard(true);
        setCurrentInputId(inputId);
        setCurrentInputValue(e.target.value);
        
        // Parse the input ID to extract inscription ID, try index, and digit index
        const match = inputId.match(/^result-(.+)-(\d+)-(\d)$/);
        if (match) {
            const [_, inscriptionId, tryIndexStr, digitIndexStr] = match;
            setCurrentInscriptionId(inscriptionId);
            setCurrentTryIndex(parseInt(tryIndexStr));
            setCurrentDigitIndex(parseInt(digitIndexStr) - 1); // Convert from 1-based to 0-based
        }
    };

    // Handle result input change
    const handleResultChange = (inscriptionId: string, tryIndex: number, value: AttemptValue | ResultCode | string | undefined) => {
        setResults(prev => {
            results[inscriptionId] = {
                tries: value
            };
            // Get existing tries for this inscription or initialize if not exists
            const existingTries = prev[inscriptionId]?.tries || [];
            
            // Create a new array of tries if needed
            let newTries = [...existingTries];
            
            
            // Return updated state
            return {
                ...prev,
                [inscriptionId]: {
                    ...prev[inscriptionId],
                    tries: newTries
                }
            };
        });
    };

    const handleVirtualKeyboardInput = (value: string) => {
        if (!currentInputId) return;

        // Convert input value to appropriate type if needed
        let inputValue: AttemptValue | ResultCode | string | undefined = value;
        if (value === 'O' || value === 'o') inputValue = AttemptValue.O;
        else if (value === 'X' || value === 'x') inputValue = AttemptValue.X;
        else if (value === '-') inputValue = AttemptValue.PASS;
        else if (value === '') inputValue = undefined;
        else if (value === 'DNF') inputValue = ResultCode.DNF;
        else if (value === 'DNS') inputValue = ResultCode.DNS;
        else if (value === 'DQ') inputValue = ResultCode.DQ;

        console.log("Input value:", inputValue, "for input ID:", currentInputId);
        console.log("Set input to:", value);
        // Update the result with the new value
        handleResultChange(currentInscriptionId, currentTryIndex, inputValue);
        
        // Update current input value for display
        setCurrentInputValue(value);

        
        // Auto advance for O and - (pass), go directly to next athlete
        if (value === 'O' || value === '-') {
            const currentRowIndex = inscriptions.findIndex(insc => insc.id.toString() === currentInscriptionId);
            if (currentRowIndex >= 0) {
                handleKeyPress(
                    { key: 'Enter', preventDefault: () => {} } as unknown as KeyboardEvent<HTMLInputElement>,
                    currentTryIndex,
                    currentRowIndex,
                    currentInscriptionId,
                    currentDigitIndex
                );
            }
        }else if (currentDigitIndex <= 2) {
            const nextDigitIndex = currentDigitIndex + 1;
            const nextInputId = `result-${currentInscriptionId}-${currentTryIndex}-${nextDigitIndex + 1}`;
            const nextInput = document.getElementById(nextInputId) as HTMLInputElement;
            if (nextInput) {
                nextInput.focus();
                setCurrentDigitIndex(nextDigitIndex);
            }
        } else {
            const currentRowIndex = inscriptions.findIndex(insc => insc.id.toString() === currentInscriptionId);
            console.log("aaaaaaaaaaaaaaaaaaaaa")
            if (currentRowIndex >= 0) {
                handleKeyPress(
                    { key: 'Enter', preventDefault: () => {} } as unknown as KeyboardEvent<HTMLInputElement>,
                    currentTryIndex,
                    currentRowIndex,
                    currentInscriptionId,
                    currentDigitIndex
                );
            }
        }
    };
    console.log("Results:", results);
    return (
        <Box sx={{ display: 'flex', flexDirection: 'column' }}>
            <Box sx={{ 
                display: 'flex', 
                width: '100%', 
                overflow: 'hidden',
                position: 'relative',
                justifyContent: 'center'
            }}>
                {/* Fixed columns (Name and Bib) */}
                <TableContainer component={Paper} sx={{ 
                    width: '300px',
                    zIndex: 2,
                    boxShadow: '5px 0 5px -2px rgba(0,0,0,0.1)'
                }}>
                    <Table stickyHeader sx={commonTableStyles}>
                        <TableHead>
                            <TableRow>
                                <TableCell sx={{ ...commonCellStyles, width: '40%', textAlign: 'left', height: '56px' }}>{t('First Name')}</TableCell>
                                <TableCell sx={{ ...commonCellStyles, width: '40%', textAlign: 'left'  }}>{t('Last Name')}</TableCell>
                                <TableCell sx={{ ...commonCellStyles, width: '20%', textAlign: 'left'  }}>{t('Bib')}</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {inscriptions.map((inscription, rowIndex) => (
                                <TableRow key={`fixed-${inscription.id || rowIndex}`}>
                                    <TableCell sx={{ 
                                        ...commonCellStyles, 
                                        textAlign: 'left',
                                        height: getRowHeight()
                                    }}>
                                        {inscription.athlete.firstName}
                                    </TableCell>
                                    <TableCell sx={{ 
                                        ...commonCellStyles, 
                                        textAlign: 'left',
                                        height: getRowHeight()
                                    }}>
                                        {inscription.athlete.lastName}
                                    </TableCell>
                                    <TableCell sx={{ 
                                        ...commonCellStyles, 
                                        textAlign: 'left',
                                        height: getRowHeight()
                                    }}>
                                        {inscription.bib}
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </TableContainer>

                {/* Scrollable columns (Tries) */}
                <TableContainer component={Paper} sx={{ 
                    maxWidth: 'calc(100% - 300px)',
                    overflowX: 'auto',
                    overflowY: 'hidden',
                    marginLeft: '0px',
                    width: 'auto',
                }}>
                    <Table stickyHeader sx={commonTableStyles}>
                        <TableHead>
                            <TableRow>
                                {Array.from({ length: nbTry }, (_, index) => index + 1).map((tryNum) => (
                                    <TableCell key={`head-${tryNum}`} sx={{ ...commonCellStyles, width: '100px', height: '56px' }}>
                                        {t('Try')} {tryNum}
                                    </TableCell>
                                ))}
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {inscriptions.map((inscription, rowIndex) => (
                                <TableRow key={`scroll-${inscription.id || rowIndex}`}>
                                    {Array.from({ length: nbTry }, (_, index) => index).map((tryIndex) => (
                                        <TableCell key={tryIndex} sx={{ 
                                            ...commonCellStyles, 
                                            width: '100px',
                                            padding: '6px 16px',
                                            height: getRowHeight()
                                        }}>
                                            <InputResultHeight
                                                inscription={inscription}
                                                tryIndex={tryIndex}
                                                rowIndex={rowIndex}
                                                result={results[inscription.id] || {tries: null}}
                                                handleInputFocus={handleInputFocus}
                                                handleResultChange={handleResultChange}
                                                handleKeyPress={handleKeyPress}
                                            />
                                        </TableCell>
                                    ))}
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </TableContainer>
            </Box>
            <HeightKeyboard 
                open={showVirtualKeyboard} 
                setOpen={setShowVirtualKeyboard} 
                inputValue={currentInputValue}
                onKeyboardInput={handleVirtualKeyboardInput}
            />
        </Box>
    );
};

