import { Alert, Box, Button, Dialog, DialogActions, DialogContent, DialogTitle, MenuItem, Select } from "@mui/material"
import { ChangeEvent, useState } from "react";
import { useTranslation } from "react-i18next";

import { XMLParser } from 'fast-xml-parser';
import { z } from 'zod';
import { AttemptValue, CreateResult, CreateResult$, CreateResultDetails$, EventType } from '@competition-manager/schemas';
import { useAtomValue } from 'jotai';
import { competitionAtom } from '../../../../GlobalsStates';
import { api } from '../../../../utils';
import { FileTable } from "./FileTable";
import axios from "axios";


type PopupProps = {
    open: boolean;
    onClose: () => void;
}


export const FilePopup: React.FC<PopupProps> = ({
    open, 
    onClose,
}) => {
    const { t } = useTranslation();

    const handleCancel = () => {
        onClose();
    }

    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);
    const [isTableVisible, setIsTableVisible] = useState(false);

    const [results, setResults] = useState<CreateResult[]>([]);
    const [eventEid, setEventEid] = useState<string>("autoDetect");

    const competition = useAtomValue(competitionAtom);
    if (!competition) throw new Error('No competition data found');
        
    const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
        if (event.target.files && event.target.files.length > 0) {
            setSelectedFile(event.target.files[0]);
            setError(null);
            setResults([]);

            try {
                const reader = new FileReader();
                
                reader.onload = async (e) => {
                    try {
                        if (!e.target?.result) throw new Error('Failed to read file');
                        
                        const fileContent = e.target.result as string;
                        const results = await processFileData(fileContent);
                        
                        setResults(results);
                        setIsTableVisible(true);
                    } catch (error) {
                        setError(error instanceof Error ? error.message : 'An unknown error occurred');
                        setIsTableVisible(false);
                    }
                };
    
                reader.onerror = () => {
                    setError('Error reading file');
                    setLoading(false);
                };     
                reader.readAsText(event.target.files[0]);
            } catch (error) {
                setError(error instanceof Error ? error.message : 'An unknown error occurred');
                setLoading(false);
                setIsTableVisible(false);
            }
    
        }
    };

    const getAttemptValue = (result: any, index : number): AttemptValue[]|undefined => {
        if (result[index].value == "X") {
            let i = 1;
            while (result[index+i]?.value == "X") {
                i++;
            }
            const attemptArray: AttemptValue[] = Array(i).fill(AttemptValue.X);
            if (i < 3) {
                attemptArray.push(AttemptValue.O);
            }
            return attemptArray;
        }
        return [AttemptValue.O]

    }
    
    const handleHeats = (heats: any, eventEid: string, competitionEid: string, eventType: EventType): CreateResult[] => {
        const results: CreateResult[] = [];

        // Ensure heats is always an array
        const heatsArray = Array.isArray(heats) ? heats : [heats];

        for (let i = 0; i < heatsArray.length; i++) {
            const heat = heatsArray[i];
            if (!heat) continue;

            // Ensure participations is always an array
            const participations = Array.isArray(heat.participations.participation) 
                ? heat.participations.participation 
                : [heat.participations.participation];

            for (let participation of participations) {
                const competitor = participation.participant.competitor;
                const athleteLicense = String(competitor.license);
                const bib = parseInt(competitor.bib);
                const initialOrder = parseInt(participation.initialorder);
                const currentOrder = parseInt(participation.currentorder);
                // Ensure results is always an array
                const results_details = Array.isArray(participation.results.result) ? participation.results.result : [participation.results.result];
                
                const details: z.infer<typeof CreateResultDetails$>[] = [];
                let tryNumber = 1;
                for (let j = 0; j < results_details.length; j++) {
                    const result = results_details[j];
                    if (!result) continue;

                    //const bestResult = result['@_bestresult'];

                    const detail: z.infer<typeof CreateResultDetails$> = {
                        tryNumber: tryNumber,
                        value: parseFloat(result.result_value),
                        wind: result.wind ? parseFloat(result.wind) : undefined,
                        attempts: eventType == EventType.HEIGHT ? getAttemptValue(results_details,j) : undefined
                    };

                    if (detail.attempts && detail.attempts.length > 1) {
                        j += detail.attempts.length -1
                    }

                    details.push(detail);
                    tryNumber++
                }

                const createResult: z.infer<typeof CreateResult$> = {
                    bib,
                    athleteLicense,
                    competitionEid,
                    competitionEventEid: eventEid,
                    heat: i + 1,
                    initialOrder: initialOrder,
                    tempOrder: currentOrder,
                    finalOrder: currentOrder,
                    details
                };

                results.push(createResult);
            }
        }

        return results;
    };

    const processFileData = async (fileData: string): Promise<CreateResult[]> => {
        try {
            const parser = new XMLParser({
                ignoreAttributes: false,
                parseAttributeValue: true,
                trimValues: true
            });
            
            const parsedData = parser.parse(fileData);
            const eventData = parsedData.event;
            const eventName = eventData.name;
            const rounds = eventData.rounds.round;
            const event = eventEid === "autoDetect" ? competition.events.find(event => event.name === eventName) : competition.events.find(event => event.eid === eventEid);
            if (!event) throw new Error('Event not found in competition data');

            let results: CreateResult[] = [];

            if (!Array.isArray(rounds)) {
                const heats = rounds.heats.heat;
                results = handleHeats(heats, event.eid, competition.eid, event.event.type);
            } else {
                for (let round of rounds) {
                    if (round['@_combinedTotal'] === 'false') {
                        const heats = round.heats.heat;
                        const roundResults = handleHeats(heats, event.eid, competition.eid, event.event.type);
                        results.push(...roundResults);
                    }
                }
            }

            return results;
        } catch (error) {
            if (error instanceof Error && error.message === 'Event not found in competition data') {
                throw error;
            } else {
                console.error('Error processing XML:', error);
                throw new Error('Failed to process XML data');
            }
        }
    };

    const uploadResults = async (results: CreateResult[]) => {
        try {
            const response = await api.post('/results', results);
            return true;
        } catch (error) {
            console.log(error);
            throw new Error('Failed to upload results');
        }
    };

    const handleUpload = async () => {
        if (!selectedFile) {
            setError('No file selected');
            return;
        }

        setLoading(true);
        setError(null);

        try {         
            if (await uploadResults(results)) {
                setSelectedFile(null);
                const fileInput = document.querySelector('input[type="file"]') as HTMLInputElement;
                if (fileInput) fileInput.value = '';
            }
        } catch (error) {
            setError(error instanceof Error ? error.message : 'An unknown error occurred');
        } finally {
            setResults([]);
            setIsTableVisible(false);
            setLoading(false);
        }

    };

    return (
        <Dialog
            open={open}
            onClose={onClose}
            fullWidth
            maxWidth="lg"
        >
            <DialogTitle>
                Upload file results
            </DialogTitle>
            <DialogContent>
                <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
                    <input 
                        type="file" 
                        onChange={handleFileChange}
                        accept=".xml"
                        disabled={loading}
                    />
                    <Select 
                        defaultValue={"autoDetect"} 
                        onChange={(e) => setEventEid(e.target.value)}
                    >
                        <MenuItem key={"autoDetect"} value={"autoDetect"}>
                            Auto detect
                        </MenuItem>
                        {competition.events.map((event) => (
                            <MenuItem key={event.eid} value={event.eid}>
                                {event.name}
                            </MenuItem>
                        ))}
                    </Select>
                </Box>
                <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
                    {selectedFile && (
                        <Box sx={{ mt: 2 }}>
                            <p>Selected file: {selectedFile.name}</p>
                        </Box>
                    )}
                </Box>

                {error && (
                    <Alert severity="error" sx={{ mt: 2 }}>
                        {error}
                    </Alert>
                )}
                {isTableVisible && (
                    <FileTable rows={results}/>
                )}
            </DialogContent>
            <DialogActions>
                <Button variant="outlined" onClick={handleCancel}>
                    {t('buttons:cancel')}
                </Button>
                <Button 
                        variant="contained" 
                        onClick={handleUpload}
                        disabled={!selectedFile || loading}
                >
                    {loading ? t("result:uploading") : t("result:upload")}
                </Button>
            </DialogActions>
        </Dialog>
    )

};