import { Paper, TextField, Box, FormControl, InputLabel, MenuItem, Select, SelectChangeEvent } from "@mui/material";
import { useAtomValue } from "jotai";
import { useTranslation } from "react-i18next";
import { adminInscriptionsAtom, competitionAtom } from '@/GlobalsStates'
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from "@mui/material";
import { CompetitionEvent } from "@competition-manager/schemas";
import { useState, KeyboardEvent, useEffect } from "react";
import { DistanceKeyboard } from "./DistanceKeyboard";

type TableLiveProps = {
    event: CompetitionEvent
};

type ResultData = {
    [key: string]: { // inscription id or some unique identifier
        tries: (string | null)[],
        wind?: (string | null)[]  // Add wind data array
    }
};

export const TableLive: React.FC<TableLiveProps> = ({ event }) => {
    const { t } = useTranslation();
    const competition = useAtomValue(competitionAtom);
    if (!competition) throw new Error('No competition data found');

    const [nbTry, setNbTry] = useState(6);
    const [trySelector, setTrySelector] = useState<string>("6");
    const [nbTryTemp, setNbTryTemp] = useState(6);
    const [isCustomTry, setIsCustomTry] = useState(false);
    const [showVirtualKeyboard, setShowVirtualKeyboard] = useState(false);
    const [currentInputId, setCurrentInputId] = useState<string | null>(null);
    const [currentInputValue, setCurrentInputValue] = useState<string>('');
    const [inputMode, setInputMode] = useState<'perf' | 'wind' | 'both'>('perf');

    const adminInscriptions = useAtomValue(adminInscriptionsAtom);
    if (!adminInscriptions) throw new Error('No inscriptions found');
    const inscriptions = adminInscriptions.filter(inscription => inscription.competitionEvent.id === event.id);

    // State to hold all results
    const [results, setResults] = useState<ResultData>({});
    
    // Handle try count selection change
    const handleTrySelectorChange = (event: SelectChangeEvent<string>) => {
        const value = event.target.value;
        setTrySelector(value);
        
        if (value === "custom") {
            setIsCustomTry(true);
            // Don't update nbTry yet, wait for custom input
        } else {
            setIsCustomTry(false);
            const tryCount = parseInt(value);
            setNbTry(tryCount);
            // Update results when changing try count, preserving existing data
            updateResultsForNewTryCount(tryCount);
        }
    };

    // Handle custom try count input
    const handleCustomTryChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setNbTryTemp(parseInt(event.target.value));
        const tryCount = parseInt(event.target.value);
        if (!isNaN(tryCount) && tryCount > 0 && tryCount <= 20) {
            setNbTry(tryCount);
            // Update results with new try count, preserving existing data
            updateResultsForNewTryCount(tryCount);
        }
    };

    // Update results with new try count while preserving existing data
    const updateResultsForNewTryCount = (tryCount: number) => {
        setResults(prevResults => {
            const updatedResults: ResultData = {};
            
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
        if (currentInputId === `result-${inscriptionId}-${tryIndex}`) {
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
    
    // Handle virtual keyboard input
    const handleVirtualKeyboardInput = (value: string) => {
        if (!currentInputId) return;
        
        // Extract inscription ID and try index from the input ID
        const match = currentInputId.match(/^(result|wind)-(.+)-(\d+)$/);
        if (!match) return;
        
        const [_, type, inscriptionId, tryIndexStr] = match;
        const tryIndex = parseInt(tryIndexStr);
        
        // Update the appropriate field based on input type
        if (type === 'result') {
            handleResultChange(inscriptionId, tryIndex, value);
        } else if (type === 'wind') {
            handleWindChange(inscriptionId, tryIndex, value);
        }
        
        setCurrentInputValue(value);
    };

    return (
        <Box sx={{ display: 'flex', flexDirection: 'column' }}>
            {/* Try count selector, Wind switch, and Virtual Keyboard switch */}
            <Box sx={{ marginBottom: '20px', display: 'flex', alignItems: 'center', gap: 2 }}>
                <FormControl variant="outlined" size="small" sx={{ width: '150px' }}>
                    <InputLabel id="try-count-select-label">{t('Number of Tries')}</InputLabel>
                    <Select
                        labelId="try-count-select-label"
                        id="try-count-select"
                        value={trySelector}
                        onChange={handleTrySelectorChange}
                        label={t('Number of Tries')}
                    >
                        <MenuItem value="3">3</MenuItem>
                        <MenuItem value="6">6</MenuItem>
                        <MenuItem value="custom">{t('Custom')}</MenuItem>
                    </Select>
                </FormControl>
                
                {isCustomTry && (
                    <TextField
                        type="number"
                        slotProps={{
                            htmlInput: { 
                                max: 100, 
                                min: 1 
                            },
                        }}
                        label={t('Custom tries')}
                        value={nbTryTemp}
                        onChange={handleCustomTryChange}
                        variant="outlined"
                        size="small"
                    />
                )}
                
                <FormControl variant="outlined" size="small" sx={{ width: '200px' }}>
                    <InputLabel id="input-mode-select-label">{t('Input Mode')}</InputLabel>
                    <Select
                        labelId="input-mode-select-label"
                        id="input-mode-select"
                        value={inputMode}
                        onChange={(e) => setInputMode(e.target.value as 'perf' | 'wind' | 'both')}
                        label={t('Input Mode')}
                    >
                        <MenuItem value="perf">{t('Only Performance')}</MenuItem>
                        <MenuItem value="wind">{t('Only Wind')}</MenuItem>
                        <MenuItem value="both">{t('Both')}</MenuItem>
                    </Select>
                </FormControl>
            </Box>

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
                                            padding: inputMode == 'both' ? '6px 16px 0 16px' : '6px 16px', // Adjust padding when wind input is shown
                                            height: getRowHeight()
                                        }}>
                                            <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 1 }}>
                                                <TextField
                                                    id={`result-${inscription.id}-${tryIndex}`}
                                                    variant="outlined"
                                                    size="small"
                                                    value={results[inscription.id]?.tries[tryIndex] || ''}
                                                    onChange={(e) => handleResultChange(inscription.id.toString(), tryIndex, e.target.value)}
                                                    onKeyDown={(e) => handleKeyPress(e as KeyboardEvent<HTMLInputElement>, tryIndex, rowIndex, inscription.id.toString())}
                                                    onFocus={(e) => handleInputFocus(e, `result-${inscription.id}-${tryIndex}`)}
                                                    inputProps={{ 
                                                        style: { textAlign: 'center' },
                                                        'aria-label': `Try ${tryIndex + 1} for ${inscription.athlete.firstName} ${inscription.athlete.lastName}`
                                                    }}
                                                    sx={{ 
                                                        width: '80px',
                                                        display: inputMode === 'wind' ? 'none' : 'block', // Hide if only wind is selected
                                                        '& .MuiInputBase-root': { height: '36px' }
                                                    }}
                                                />
                                                {inputMode != 'perf' && (
                                                    <TextField
                                                        id={`wind-${inscription.id}-${tryIndex}`}
                                                        variant="outlined"
                                                        size="small"
                                                        placeholder={t('Wind')}
                                                        value={results[inscription.id]?.wind?.[tryIndex] || ''}
                                                        onChange={(e) => handleWindChange(inscription.id.toString(), tryIndex, e.target.value)}
                                                        onKeyDown={(e) => handleWindKeyPress(e as KeyboardEvent<HTMLInputElement>, tryIndex, rowIndex)}
                                                        onFocus={(e) => handleInputFocus(e, `wind-${inscription.id}-${tryIndex}`)}
                                                        inputProps={{ 
                                                            style: { textAlign: 'center' },
                                                            'aria-label': `Wind for try ${tryIndex + 1} for ${inscription.athlete.firstName} ${inscription.athlete.lastName}`
                                                        }}
                                                        sx={{ 
                                                            width: '80px',
                                                            '& .MuiInputBase-root': { height: '28px' }
                                                        }}
                                                    />
                                                )}
                                            </Box>
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

