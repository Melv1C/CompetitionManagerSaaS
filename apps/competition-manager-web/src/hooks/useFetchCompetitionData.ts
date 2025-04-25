import {
    getAdminInscriptions,
    getCompetition,
    getInscriptions,
    getResults,
    getUsersInscriptions,
    syncResults,
} from '@/api';
import {
    adminInscriptionsAtom,
    competitionAtom,
    inscriptionsAtom,
    resultsAtom,
    userInscriptionsAtom,
} from '@/GlobalsStates';
import { getSocket, joinCompetitionRoom, subscribeToNewResults } from '@/utils';
import { Result } from '@competition-manager/schemas';
import { useAtom } from 'jotai';
import { useEffect, useRef, useState } from 'react';
import { useQuery } from 'react-query';

export const useFetchCompetitionData = (
    eid: string,
    isAdmin: boolean = false
) => {
    const [globalComp, setCompetition] = useAtom(competitionAtom);
    const [globalInscriptions, setInscriptions] = useAtom(inscriptionsAtom);
    const [globalUserInscriptions, setUserInscriptions] =
        useAtom(userInscriptionsAtom);
    const [globalAdminInscriptions, setAdminInscriptions] = useAtom(
        adminInscriptionsAtom
    );
    const [globalResults, setResults] = useAtom(resultsAtom);

    const [isInitialized, setIsInitialized] = useState(false);
    const [isSocketConnected, setIsSocketConnected] = useState(false);

    // Track the latest result timestamp we've received
    const lastResultTimestampRef = useRef<number>(0);
    // Track health check interval
    const healthCheckIntervalRef = useRef<number | null>(null);

    const {
        data: competition,
        isLoading: isCompetitionLoading,
        isError: isCompetitionError,
        refetch: refetchCompetition,
    } = useQuery(['competition', eid], () => getCompetition(eid, isAdmin), {
        enabled: isInitialized,
    });
    const {
        data: inscriptions,
        isLoading: isInscriptionsLoading,
        isError: isInscriptionsError,
        refetch: refetchInscriptions,
    } = useQuery(['inscriptions', eid], () => getInscriptions(eid), {
        enabled: isInitialized,
    });
    const {
        data: userInscriptions,
        isLoading: isUserInscriptionsLoading,
        isError: isUserInscriptionsError,
        refetch: refetchUserInscriptions,
    } = useQuery(['userInscriptions', eid], () => getUsersInscriptions(eid), {
        enabled: isInitialized,
    });
    const {
        data: adminInscriptions,
        isLoading: isAdminInscriptionsLoading,
        isError: isAdminInscriptionsError,
        refetch: refetchAdminInscriptions,
    } = useQuery(
        ['adminInscriptions', eid],
        () => {
            if (isAdmin) return getAdminInscriptions(eid);
            return [];
        },
        { enabled: isInitialized }
    );

    const {
        data: results,
        isLoading: isResultsLoading,
        isError: isResultsError,
        refetch: refetchResults,
    } = useQuery(['results', eid], () => getResults(eid), {
        enabled: isInitialized,
        onSuccess: (data) => {
            // Update the latest timestamp if results contain newer data
            if (data && data.length > 0) {
                const timestamps = data.map((result) =>
                    new Date(result.updatedAt || result.createdAt).getTime()
                );
                const latestTimestamp = Math.max(...timestamps);
                if (latestTimestamp > lastResultTimestampRef.current) {
                    lastResultTimestampRef.current = latestTimestamp;
                }
            }
        },
    });

    const isLoading =
        isCompetitionLoading ||
        isInscriptionsLoading ||
        isUserInscriptionsLoading ||
        (isAdmin && isAdminInscriptionsLoading) ||
        isResultsLoading;
    const isLoaded =
        globalComp &&
        globalInscriptions &&
        globalUserInscriptions &&
        (!isAdmin || globalAdminInscriptions) &&
        globalResults;

    // Initialize data fetching
    useEffect(() => {
        if (!isLoaded && !isLoading && !isInitialized) {
            setIsInitialized(true);
        }
    }, [isLoaded, isLoading, isInitialized]);

    // Set up socket connection for live results, but only on the day of the competition or for admins
    useEffect(() => {
        if (competition && !isSocketConnected) {
            // Check if today is the day of the competition
            const startDate = new Date(competition.date);
            startDate.setHours(0, 0, 0, 0);
            const endDate = competition.closeDate
                ? new Date(competition.closeDate)
                : new Date(competition.date);
            endDate.setHours(23, 59, 59, 999); // End of the day
            const today = new Date();

            // Only connect if user is admin OR today is between the start and end dates (inclusive)
            const isCompetitionDay = today >= startDate && today <= endDate;

            if (isAdmin || true) {
                console.log(
                    'Connecting to real-time results - ' +
                        (isAdmin ? 'Admin user' : 'Competition is today')
                );

                // Connect to socket and join the competition room
                const setupSocketConnection = async () => {
                    try {
                        // Join the competition room to receive updates
                        await joinCompetitionRoom(eid);
                        setIsSocketConnected(true);

                        // Setup socket reconnection handler
                        const socket = getSocket();

                        socket.on('reconnect', async () => {
                            console.log(
                                'Socket reconnected, syncing missed results since',
                                new Date(lastResultTimestampRef.current)
                            );

                            // Re-join the room
                            await joinCompetitionRoom(eid);

                            // Request sync for missed events
                            if (lastResultTimestampRef.current > 0) {
                                await syncMissedResults();
                            }
                        });

                        // Start periodic health check
                        startHealthCheck();
                    } catch (error) {
                        console.error(
                            'Failed to set up socket connection:',
                            error
                        );
                    }
                };

                setupSocketConnection();
            } else {
                console.log(
                    'Skipping real-time results connection - Not admin and competition is not today'
                );
            }
        }

        return () => {
            // Clean up health check on unmount
            if (healthCheckIntervalRef.current !== null) {
                window.clearInterval(healthCheckIntervalRef.current);
            }
        };
    }, [competition, eid, isSocketConnected]);

    // Function to sync missed results using HTTP endpoint
    const syncMissedResults = async () => {
        try {
            // Then fetch the missed results via HTTP
            const missedResults = await syncResults(
                eid,
                lastResultTimestampRef.current
            );

            if (missedResults && missedResults.length > 0) {
                console.log(`Synced ${missedResults.length} missed results`);

                // Update the results state with the missed results
                setResults((currentResults) => {
                    if (!currentResults) return missedResults;

                    // Merge missed results with current results
                    const updatedResults = [...currentResults];

                    for (const missedResult of missedResults) {
                        const index = updatedResults.findIndex(
                            (r) => r.id === missedResult.id
                        );
                        if (index !== -1) {
                            // Update existing result
                            updatedResults[index] = missedResult;
                        } else {
                            // Add new result
                            updatedResults.push(missedResult);
                        }
                    }

                    return updatedResults;
                });

                // Update the latest timestamp
                const timestamps = missedResults.map((result) =>
                    new Date(result.updatedAt || result.createdAt).getTime()
                );
                const latestTimestamp = Math.max(...timestamps);
                if (latestTimestamp > lastResultTimestampRef.current) {
                    lastResultTimestampRef.current = latestTimestamp;
                }
            }
        } catch (error) {
            console.error('Failed to sync missed results:', error);
        }
    };

    // Start periodic health check to ensure we don't miss events
    const startHealthCheck = () => {
        // Check every 30 seconds if we're still connected and in sync
        healthCheckIntervalRef.current = window.setInterval(() => {
            const socket = getSocket();

            // If socket is disconnected but we think we're connected, try to reconnect
            if (!socket.connected && isSocketConnected) {
                console.log(
                    'Health check: Socket disconnected unexpectedly, attempting to reconnect'
                );
                socket.connect();
            } else if (socket.connected) {
                // If we are connected, sync any potentially missed results
                syncMissedResults();
            }
        }, 30000); // 30 seconds
    };

    // Subscribe to real-time result updates
    useEffect(() => {
        if (isSocketConnected) {
            // Subscribe to new result events
            const unsubscribe = subscribeToNewResults((newResult: Result) => {
                console.log('Received new result:', newResult);

                // Update the timestamp for the latest result
                const resultTimestamp = new Date(
                    newResult.updatedAt || newResult.createdAt
                ).getTime();
                if (resultTimestamp > lastResultTimestampRef.current) {
                    lastResultTimestampRef.current = resultTimestamp;
                }

                // Update the results atom with the new result
                setResults((currentResults) => {
                    if (!currentResults) return [newResult];

                    // Check if we already have this result and update it
                    const resultIndex = currentResults.findIndex(
                        (r) => r.id === newResult.id
                    );

                    if (resultIndex !== -1) {
                        // Update existing result
                        const updatedResults = [...currentResults];
                        updatedResults[resultIndex] = newResult;
                        return updatedResults;
                    } else {
                        // Add new result
                        return [...currentResults, newResult];
                    }
                });
            });

            // Clean up subscription on unmount
            return () => {
                unsubscribe();
            };
        }
    }, [isSocketConnected, setResults]);

    // Update atoms when data is fetched
    useEffect(() => {
        if (competition) {
            setCompetition(competition);
        }
    }, [competition, setCompetition]);

    useEffect(() => {
        if (inscriptions) {
            setInscriptions(inscriptions);
        }
    }, [inscriptions, setInscriptions]);

    useEffect(() => {
        if (userInscriptions) {
            setUserInscriptions(userInscriptions);
        }
    }, [userInscriptions, setUserInscriptions]);

    useEffect(() => {
        if (adminInscriptions) {
            setAdminInscriptions(adminInscriptions);
        }
    }, [adminInscriptions, setAdminInscriptions]);

    useEffect(() => {
        if (results) {
            setResults(results);
        }
    }, [results, setResults]);

    if (isCompetitionError) throw new Error('Error while fetching competition');
    if (isInscriptionsError)
        throw new Error('Error while fetching inscriptions');
    if (isUserInscriptionsError)
        throw new Error('Error while fetching user inscriptions');
    if (isAdmin && isAdminInscriptionsError)
        throw new Error('Error while fetching admin inscriptions');
    if (isResultsError) throw new Error('Error while fetching results');

    const refresh = () => {
        refetchCompetition();
        refetchInscriptions();
        refetchUserInscriptions();
        refetchResults();
        if (isAdmin) {
            refetchAdminInscriptions();
        }

        // Also sync any potentially missed real-time updates
        if (isSocketConnected && lastResultTimestampRef.current > 0) {
            syncMissedResults();
        }
    };

    const reset = () => {
        console.log('Resetting competition data');
        setCompetition(null);
        setInscriptions(null);
        setUserInscriptions(null);
        setAdminInscriptions(null);
        setResults(null);
        lastResultTimestampRef.current = 0;

        // Clear health check interval
        if (healthCheckIntervalRef.current !== null) {
            window.clearInterval(healthCheckIntervalRef.current);
            healthCheckIntervalRef.current = null;
        }
    };

    return {
        isLoading: isLoading || !isLoaded || !isInitialized,
        competition,
        refresh,
        reset,
    };
};
