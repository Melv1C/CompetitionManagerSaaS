import { Paper, Box } from "@mui/material";
import { useAtomValue } from "jotai";
import { useTranslation } from "react-i18next";
import { adminInscriptionsAtom, competitionAtom, resultsAtom } from '@/GlobalsStates'
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from "@mui/material";
import { useState, KeyboardEvent, useEffect, useMemo } from "react";
import { DistanceKeyboard } from "../components";
import { EncodeProps, ResultsData } from "./type";
import { InputResult } from "./InputResult";
import { LiveOptions } from "./LiveOptions";
import { getResults } from "@/api";


export const DistanceEncode: React.FC<EncodeProps> = ({ event }) => {
    const { t } = useTranslation();
    const competition = useAtomValue(competitionAtom);
    if (!competition) throw new Error('No competition data found');

    const results = useAtomValue(resultsAtom);
    if (!results) throw new Error('No results data found');
    const eventResults = useMemo(() => results.filter(result => result.competitionEvent.id === event.id), [results, event.id]);

    const [nbTry, setNbTry] = useState(6);
    const [showVirtualKeyboard, setShowVirtualKeyboard] = useState(false);
    const [currentInputId, setCurrentInputId] = useState<string | null>(null);
    const [currentInputValue, setCurrentInputValue] = useState<string>('');
    const [inputMode, setInputMode] = useState<'perf' | 'wind' | 'both'>('perf');

    const adminInscriptions = useAtomValue(adminInscriptionsAtom);
    if (!adminInscriptions) throw new Error('No inscriptions found');
    const inscriptions = adminInscriptions.filter(inscription => inscription.competitionEvent.id === event.id);

    // Update results with new try count while preserving existing data
    const updateResultsForNewTryCount = (tryCount: number) => {
        setResults(prevResults => {
            const updatedResults: ResultsData = {};
            
            inscriptions.forEach(inscription => {
                const inscriptionId = inscription.id;
                const existingTries = prevResults[inscriptionId]?.tries || [];
                const existingWind = prevResults[inscriptionId]?.wind || [];
                
                // Preserve existing data, either truncate or extend the array as needed
                const newTries = Array.from({ length: tryCount }, (_, index) => 
                    index < existingTries.length ? existingTries[index] : null
                );
                
                const newWind = Array.from({ length: tryCount }, (_, index) => 
                    index < existingWind.length ? existingWind[index] : null
                );
                
                updatedResults[inscriptionId] = { 
                    tries: newTries,
                    wind: newWind
                };
            });
            
            return updatedResults;
        });
    };
    
    // Initialize results if not yet set
    useEffect(() => {
        if (inscriptions.length > 0 && Object.keys(results).length === 0) {
            updateResultsForNewTryCount(nbTry);
        }
        console.log("Results:", results);
    }, [inscriptions, results]);

    // Handle key press to move to next cell
    const handleKeyPress = (
        event: KeyboardEvent<HTMLInputElement>,
        tryIndex: number,
        rowIndex: number,
        inscriptionId: string
    ) => {
        if (event.key === 'Enter') {
            event.preventDefault();
            
            // If in "both" mode, move to the wind input for the same try
            if (inputMode === 'both') {
                const windCellId = `wind-${inscriptionId}-${tryIndex}`;
                const windElement = document.getElementById(windCellId);
                windElement?.focus();
                return;
            }
            
            // Move to next inscription in the same try column
            const nextRowIndex = rowIndex + 1;
            
            // If there are more inscriptions for this try
            if (nextRowIndex < inscriptions.length) {
                const nextInscriptionId = inscriptions[nextRowIndex].id;
                const nextCellId = `result-${nextInscriptionId}-${tryIndex}`;
                const nextElement = document.getElementById(nextCellId);
                nextElement?.focus();
            } 
            // If we're at the last inscription for this try, move to the first inscription of the next try
            else if (tryIndex < nbTry - 1) {
                const nextTryIndex = tryIndex + 1;
                const firstInscriptionId = inscriptions[0].id;
                const nextCellId = `result-${firstInscriptionId}-${nextTryIndex}`;
                const nextElement = document.getElementById(nextCellId);
                nextElement?.focus();
            }
        }
    };

    // Handle key press to move between wind inputs
    const handleWindKeyPress = (
        event: KeyboardEvent<HTMLInputElement>,
        tryIndex: number,
        rowIndex: number
    ) => {
        if (event.key === 'Enter') {
            event.preventDefault();
            
            // If in "both" mode, move to the next athlete's performance input
            if (inputMode === 'both') {
                const nextRowIndex = rowIndex + 1;
                
                // If there are more inscriptions for this try
                if (nextRowIndex < inscriptions.length) {
                    const nextInscriptionId = inscriptions[nextRowIndex].id;
                    const nextCellId = `result-${nextInscriptionId}-${tryIndex}`;
                    const nextElement = document.getElementById(nextCellId);
                    nextElement?.focus();
                } 
                // If we're at the last inscription for this try, move to the first inscription of the next try
                else if (tryIndex < nbTry - 1) {
                    const nextTryIndex = tryIndex + 1;
                    const firstInscriptionId = inscriptions[0].id;
                    const nextCellId = `result-${firstInscriptionId}-${nextTryIndex}`;
                    const nextElement = document.getElementById(nextCellId);
                    nextElement?.focus();
                }
                return;
            }

            // Move to next inscription in the same try column
            const nextRowIndex = rowIndex + 1;
            
            // If there are more inscriptions for this try
            if (nextRowIndex < inscriptions.length) {
                const nextInscriptionId = inscriptions[nextRowIndex].id;
                const nextCellId = `wind-${nextInscriptionId}-${tryIndex}`;
                const nextElement = document.getElementById(nextCellId);
                nextElement?.focus();
            } 
            // If we're at the last inscription for this try, move to the first inscription of the next try
            else if (tryIndex < nbTry - 1) {
                const nextTryIndex = tryIndex + 1;
                const firstInscriptionId = inscriptions[0].id;
                const nextCellId = `wind-${firstInscriptionId}-${nextTryIndex}`;
                const nextElement = document.getElementById(nextCellId);
                nextElement?.focus();
            }
        }
    };

    // Add this to ensure consistent styling
    const commonCellStyles = {
        padding: '6px 16px',   // Match MUI default padding or adjust as needed
        boxSizing: 'border-box' as 'border-box',
        textAlign: 'center'
    };

    // Calculate row height based on whether wind input is shown
    const getRowHeight = () => {
        return inputMode == 'both' ? '85px' : '56px';  // Increased height when wind input is shown
    };

    const commonTableStyles = {
        borderCollapse: 'separate',
        borderSpacing: 0,
        tableLayout: 'fixed' as 'fixed',
        display: 'block',
    };

    // Calculate the best performance from an array of tries
    const calculateBestPerformance = (tries: (string | null)[]): string => {
        const validTries = tries.filter(try_ => try_ !== null && try_ !== '')
            .map(try_ => parseFloat(try_ as string))
            .filter(value => !isNaN(value));
        
        if (validTries.length === 0) return "-";
        return Math.max(...validTries).toString();
    };

    // Focus handler for inputs
    const handleInputFocus = (e: any, inputId: string) => {
        setShowVirtualKeyboard(true);
        setCurrentInputId(inputId);
        setCurrentInputValue(e.target.value);
    };

    // Handle result input change
    const handleResultChange = (inscriptionId: string, tryIndex: number, value: string) => {
        setResults(prev => ({
            ...prev,
            [inscriptionId]: {
                ...prev[inscriptionId],
                tries: prev[inscriptionId]?.tries.map((try_, index) => 
                    index === tryIndex ? value : try_
                ) || []
            }
        }));
        
        // Update current input value for virtual keyboard
        if (currentInputId?.startsWith(`result-${inscriptionId}-${tryIndex}`)) {
            setCurrentInputValue(value);
        }
    };

    // Handle wind input change
    const handleWindChange = (inscriptionId: string, tryIndex: number, value: string) => {
        setResults(prev => ({
            ...prev,
            [inscriptionId]: {
                ...prev[inscriptionId],
                wind: prev[inscriptionId]?.wind?.map((wind, index) => 
                    index === tryIndex ? value : wind
                ) || []
            }
        }));
        
        // Update current input value for virtual keyboard
        if (currentInputId === `wind-${inscriptionId}-${tryIndex}`) {
            setCurrentInputValue(value);
        }
    };
    
    // Handle virtual keyboard input
    const handleVirtualKeyboardInput = (value: string) => {
        if (!currentInputId) return;
        
        // Extract inscription ID and try index from the input ID
        const match = currentInputId.match(/^(result|wind)-(.+)-(\d+)(?:-(\d))?$/);
        if (!match) return;
        
        const [_, type, inscriptionId, tryIndexStr, subIndex] = match;
        const tryIndex = parseInt(tryIndexStr);
        
        // Update the appropriate field based on input type
        if (type === 'result') {
            if (subIndex) {
                // For height mode, digit inputs are handled separately in the InputResultHeight component
                // We would need to combine the current digits
                const currentHeight = results[inscriptionId]?.tries[tryIndex] || '';
                const digitIndex = parseInt(subIndex) - 1;
                
                // Split current height into digits, update the specific one, then join
                let digits = currentHeight.split('');
                while (digits.length < 3) digits.push('');
                digits[digitIndex] = value.charAt(0);
                
                const newHeight = digits.join('').trim();
                handleResultChange(inscriptionId, tryIndex, newHeight);
            } else {
                handleResultChange(inscriptionId, tryIndex, value);
            }
        } else if (type === 'wind') {
            handleWindChange(inscriptionId, tryIndex, value);
        }
        
        setCurrentInputValue(value);
    };

    return (
        <Box sx={{ display: 'flex', flexDirection: 'column' }}>
            <LiveOptions 
                setNbTry={setNbTry} 
                updateResultsForNewTryCount={updateResultsForNewTryCount} 
                inputMode={inputMode} 
                setInputMode={setInputMode}
            />

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
                                <TableCell 
                                    key="head-best-perf" 
                                    sx={{ ...commonCellStyles, width: '120px', fontWeight: 'bold', backgroundColor: '#f5f5f5', height: '56px', whiteSpace: 'nowrap'}}
                                >
                                    {t('Best Perf')}
                                </TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {inscriptions.map((inscription, rowIndex) => (
                                <TableRow key={`scroll-${inscription.id || rowIndex}`}>
                                    {Array.from({ length: nbTry }, (_, index) => index).map((tryIndex) => (
                                        <TableCell key={tryIndex} sx={{ 
                                            ...commonCellStyles, 
                                            width: '100px',
                                            padding: (inputMode === 'both') ? '6px 16px 0 16px' : '6px 16px', // Adjust padding when wind input is shown
                                            height: getRowHeight()
                                        }}>
                                            <InputResult
                                                inscription={inscription} 
                                                tryIndex={tryIndex} 
                                                rowIndex={rowIndex} 
                                                results={results}
                                                handleKeyPress={handleKeyPress} 
                                                handleInputFocus={handleInputFocus} 
                                                inputMode={inputMode} 
                                                handleWindKeyPress={handleWindKeyPress}
                                                handleResultChange={handleResultChange}
                                                handleWindChange={handleWindChange}
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
                                            height: getRowHeight()
                                        }}
                                    >
                                        {results[inscription.id] ? 
                                            calculateBestPerformance(results[inscription.id].tries) : 
                                            "-"
                                        }
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
                inputValue={currentInputValue}
                onKeyboardInput={handleVirtualKeyboardInput}
            />
        </Box>
    );
};

