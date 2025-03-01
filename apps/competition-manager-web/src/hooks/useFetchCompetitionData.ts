import {
    getAdminInscriptions,
    getCompetition,
    getInscriptions,
    getUsersInscriptions,
} from '@/api';
import {
    adminInscriptionsAtom,
    competitionAtom,
    inscriptionsAtom,
    userInscriptionsAtom,
} from '@/GlobalsStates';
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

    const [isInitialized, setIsInitialized] = useState(false);

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

    const isLoading =
        isCompetitionLoading ||
        isInscriptionsLoading ||
        isUserInscriptionsLoading ||
        (isAdmin && isAdminInscriptionsLoading);
    const isLoaded =
        globalComp &&
        globalInscriptions &&
        globalUserInscriptions &&
        (!isAdmin || globalAdminInscriptions);

    useEffect(() => {
        if (!isLoaded && !isLoading && !isInitialized) {
            setIsInitialized(true);
        }
    }, [isLoaded, isLoading, isInitialized]);

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

    if (isCompetitionError) throw new Error('Error while fetching competition');
    if (isInscriptionsError)
        throw new Error('Error while fetching inscriptions');
    if (isUserInscriptionsError)
        throw new Error('Error while fetching user inscriptions');
    if (isAdmin && isAdminInscriptionsError)
        throw new Error('Error while fetching admin inscriptions');

    const refresh = () => {
        refetchCompetition();
        refetchInscriptions();
        refetchUserInscriptions();
        if (isAdmin) {
            refetchAdminInscriptions();
        }
    };

    const reset = () => {
        console.log('Resetting competition data');
        setCompetition(null);
        setInscriptions(null);
        setUserInscriptions(null);
        setAdminInscriptions(null);
    };

    return {
        isLoading: isLoading || !isLoaded || !isInitialized,
        competition,
        refresh,
        reset,
    };
};
