import { competitionAtom } from '@/GlobalsStates';
import {
    joinCompetitionRoom,
    setLogCallback,
    subscribeToNewResults,
} from '@/utils/socket';
import { Box, Paper, Typography } from '@mui/material';
import { useAtomValue } from 'jotai';
import { useCallback, useEffect, useState } from 'react';
import { newResult } from '@/utils';

type LogEntry = {
    timestamp: string;
    text: string;
};

export const AutoEncoding = () => {
    const competition = useAtomValue(competitionAtom);
    const [logs, setLogs] = useState<LogEntry[]>([]); // Function to add a new log entry
    const addLog = useCallback((text: string) => {
        const now = new Date();
        // Use local time format instead of UTC
        const timestamp = now.toLocaleTimeString([], {
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit',
            hour12: false,
        });

        setLogs((prevLogs) => [...prevLogs, { timestamp, text }]);
    }, []); // Handle connection and logging
    useEffect(() => {
        if (!competition) return;

        addLog(`Connected to competition: ${competition.name}`);

        // Join the competition room
        joinCompetitionRoom(competition.eid).catch((error) =>
            addLog(`Error joining competition room: ${error.message}`)
        );

        // Subscribe to new results
        const unsubscribe = subscribeToNewResults((result) => {
            addLog(
                `New result received: Event=${result.competitionEvent.name}, Athlete=${result.athlete.firstName} ${result.athlete.lastName}`
            );
            newResult(result)
        });

        // Register our log function with the socket utility
        setLogCallback(addLog);

        return () => {
            // Clean up by removing the log callback when component unmounts
            setLogCallback(null);
            // Clean up the subscription
            unsubscribe();
        };
    }, [competition, addLog]);

    if (!competition) {
        return <Box>Loading ...</Box>;
    }

    return (
        <Box>
            <Paper
                elevation={3}
                sx={{
                    height: '300px',
                    maxHeight: '300px',
                    overflow: 'auto',
                    backgroundColor: '#222',
                    color: '#0f0',
                    p: 2,
                    fontFamily: 'monospace',
                    borderRadius: '4px',
                    position: 'relative',
                }}
            >
                <Typography
                    variant="subtitle2"
                    component="div"
                    sx={{ mb: 1, color: '#0f0' }}
                >
                    Log
                </Typography>
                {logs.map((log, index) => (
                    <Box key={index} sx={{ mb: 0.5, display: 'flex' }}>
                        <Typography
                            component="span"
                            sx={{ color: '#0ff', mr: 1 }}
                        >
                            [{log.timestamp}]
                        </Typography>
                        <Typography component="span">{log.text}</Typography>
                    </Box>
                ))}
            </Paper>
        </Box>
    );
};
