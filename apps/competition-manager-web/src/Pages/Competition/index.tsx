import { Box, Tab, Tabs, Typography } from "@mui/material";
import { useTranslation } from "react-i18next";
import { Navigate, Route, Routes, useLocation, useNavigate, useParams } from "react-router-dom";
import { competitionAtom, inscriptionsAtom } from "../../GlobalsStates";
import { useAtom } from "jotai";
import { useQuery } from "react-query";
import { getCompetition, getInscriptions } from "../../api";
import { Loading, MaxWidth } from "../../Components";
import { useEffect, useMemo } from "react";
import { Inscription } from "./Inscription";
import { Schedule } from "./Schedule";
import { useCompetition } from "../../hooks";
import { Competition as CompetitionType } from "@competition-manager/schemas";
import { Overview } from "./Overview";
import { Inscriptions } from "./Inscriptions";

/**
 * Extracts the first part of a path
 * @param path The path to extract the first part from
 * @returns The first part of the path
 * @example
 * extract('') // null
 * extract('/') // null
 * extract('/schedule') // 'schedule'
 * extract('/events/1') // 'events'
*/
function extract(path: string): string | null {
    const match = path.match(/^\/([^/]+)/);
    return match ? match[1] : null;
}

export const Competition = () => {

    const [globalComp, setCompetition] = useAtom(competitionAtom);
    const [globalInscriptions, setInscriptions] = useAtom(inscriptionsAtom);
    const { eid } = useParams();

    if (!eid) throw new Error('No competition ID provided');

    const { data: competition, isLoading: isCompetitionLoading, isError: isCompetitionError } = useQuery(['competition', eid], () => getCompetition(eid));
    const { data: inscriptions, isLoading: isInscriptionsLoading, isError: isInscriptionsError } = useQuery(['inscriptions', eid], () => getInscriptions(eid));
    const isLoading = isCompetitionLoading || isInscriptionsLoading;
    const isLoaded = globalComp && globalInscriptions;

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

    if (isCompetitionError) throw new Error('Error while fetching competition');
    if (isInscriptionsError) throw new Error('Error while fetching inscriptions');

    if (isLoading || !isLoaded) return <Loading />;

    return (
        <MaxWidth>
            <Typography variant="h4" textAlign='center'>{globalComp.name}</Typography>
            <CompetitionNavbar competition={globalComp} />
        </MaxWidth>
    )
}

type CompetitionNavbarProps = {
    competition: CompetitionType;
}

const CompetitionNavbar: React.FC<CompetitionNavbarProps> = ({ competition }) => {
    const { t } = useTranslation();
    const navigate = useNavigate();
    const location = useLocation();
    const {isPast, isFuture, isCurrent} = useCompetition();

    const activeTab = useMemo(() => extract(location.pathname.replace(`/competitions/${competition.eid}`, '')) || '', [location.pathname]);

    return (
        <>
            <Box sx={{ display: 'flex', justifyContent: 'center', mb: 2 }}>
                <Tabs value={activeTab} onChange={(_, v) => {
                    if (v === "") return navigate(`/competitions/${competition.eid}`);
                    navigate(`/competitions/${competition.eid}/${v}`);
                }} variant="scrollable" scrollButtons allowScrollButtonsMobile>
                    <Tab label={t('navigation:overview')} value="" />
                    {isFuture && <Tab label={t('navigation:register')} value="register" />}
                    <Tab label={t('navigation:schedule')} value="schedule" />
                    {(isFuture || isCurrent) && <Tab label={t('glossary:inscriptions')} value="inscriptions" />}
                    {isCurrent && <Tab label={t('glossary:liveResults')} value="liveResults" />}
                    {isPast && <Tab label={t('glossary:results')} value="results" />}
                </Tabs>
            </Box>

            <Routes>
                <Route path="/" element={<Overview />} />
                {isFuture && <Route path="/register" element={<Inscription />} />}
                <Route path="/schedule" element={<Schedule />} />
                {(isFuture || isCurrent) && <Route path="/inscriptions" element={<Inscriptions />} />}
                {isCurrent && <Route path="/liveResults" element={<Box>{t('glossary:liveResults')}</Box>} />}
                {isPast && <Route path="/results" element={<Box>{t('glossary:results')}</Box>} />}
                <Route path="*" element={<Navigate to={`/competitions/${competition.eid}`} />} />
            </Routes>
        
        </>
    )
}

