import { useAtom } from "jotai";
import { adminInscriptionsAtom, competitionAtom, inscriptionsAtom, userInscriptionsAtom } from "../GlobalsStates";
import { useQuery } from "react-query";
import { getAdminInscriptions, getCompetition, getInscriptions, getUsersInscriptions } from "../api";
import { useEffect } from "react";


export const useFetchCompetitionData = (eid: string, isAdmin: boolean = false) => {
    const [globalComp, setCompetition] = useAtom(competitionAtom);
    const [globalInscriptions, setInscriptions] = useAtom(inscriptionsAtom);
    const [globalUserInscriptions, setUserInscriptions] = useAtom(userInscriptionsAtom);
    const [globalAdminInscriptions, setAdminInscriptions] = useAtom(adminInscriptionsAtom);

    const { data: competition, isLoading: isCompetitionLoading, isError: isCompetitionError } = useQuery(['competition', eid], () => getCompetition(eid));
    const { data: inscriptions, isLoading: isInscriptionsLoading, isError: isInscriptionsError } = useQuery(['inscriptions', eid], () => getInscriptions(eid));
    const { data: userInscriptions, isLoading: isUserInscriptionsLoading, isError: isUserInscriptionsError } = useQuery(['userInscriptions', eid], () => getUsersInscriptions(eid));
    const { data: adminInscriptions, isLoading: isAdminInscriptionsLoading, isError: isAdminInscriptionsError } = useQuery(['adminInscriptions', eid], () => {
        if (isAdmin) return getAdminInscriptions(eid);
        return [];
    });
    const isLoading = isCompetitionLoading || isInscriptionsLoading || isUserInscriptionsLoading || (isAdmin && isAdminInscriptionsLoading);
    const isLoaded = globalComp && globalInscriptions && globalUserInscriptions && (!isAdmin || globalAdminInscriptions);

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

    // Clean up
    useEffect(() => {
        return () => {
            console.log('Cleaning up');
            setCompetition(null);
            setInscriptions(null);
            setUserInscriptions(null);
            setAdminInscriptions(null);
        };
    }, [setCompetition, setInscriptions, setUserInscriptions, setAdminInscriptions]);

    if (isCompetitionError) throw new Error('Error while fetching competition');
    if (isInscriptionsError) throw new Error('Error while fetching inscriptions');
    if (isUserInscriptionsError) throw new Error('Error while fetching user inscriptions');
    if (isAdmin && isAdminInscriptionsError) throw new Error('Error while fetching admin inscriptions');

    return { 
        isLoading: isLoading || !isLoaded,
        competition,
    };
};