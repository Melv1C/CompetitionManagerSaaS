import {
    getAdminInscriptions,
    getCompetition,
    getInscriptions,
    getResults,
    getUsersInscriptions,
} from '@/api';
import {
    adminInscriptionsAtom,
    competitionAtom,
    inscriptionsAtom,
    resultsAtom,
    userInscriptionsAtom,
} from '@/GlobalsStates';
import { joinCompetitionRoom, subscribeToNewResults } from '@/utils';
import { Result } from '@competition-manager/schemas';
import { useAtom } from 'jotai';
import { useEffect, useState } from 'react';
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

    // Set up socket connection for live results
    useEffect(() => {
        if (competition && !isSocketConnected) {
            // Join the competition room to receive updates
            joinCompetitionRoom(eid);
            setIsSocketConnected(true);
        }
    }, [competition, eid, isSocketConnected]);

    // Subscribe to real-time result updates
    useEffect(() => {
        if (isSocketConnected) {
            // Subscribe to new result events
            const unsubscribe = subscribeToNewResults((newResult: Result) => {
                console.log('Received new result:', newResult);

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
        refetchResults();
    };

    const reset = () => {
        console.log('Resetting competition data');
        setCompetition(null);
        setInscriptions(null);
        setUserInscriptions(null);
        setAdminInscriptions(null);
        setResults(null);
    };

    return {
        isLoading: isLoading || !isLoaded || !isInitialized,
        competition,
        refresh,
        reset,
    };
};
