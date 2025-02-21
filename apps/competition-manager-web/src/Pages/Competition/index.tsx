import { Box, Tab, Tabs, Typography } from "@mui/material";
import { useTranslation } from "react-i18next";
import { Navigate, Route, Routes, useLocation, useNavigate, useParams } from "react-router-dom";
import { Loading, MaxWidth } from "../../Components";
import { useEffect, useMemo } from "react";
import { useCompetition, useFetchCompetitionData } from "../../hooks";
import { Competition as CompetitionType } from "@competition-manager/schemas";

import { Overview } from "./Overview";
import { Inscription } from "./Inscription";
import { Schedule } from "./Schedule";
import { Inscriptions } from "./Inscriptions";
import { Event } from "./Event.tsx";

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
    const { competitionEid } = useParams();
    if (!competitionEid) throw new Error('No competition EID provided');

    const { competition, isLoading, reset } = useFetchCompetitionData(competitionEid);

    useEffect(() => {
        return () => {
            reset();
        }
    }, []);

    if (isLoading) return <Loading />;

    return (
        <MaxWidth>
            <Typography variant="h4" textAlign='center'>{competition!.name}</Typography>
            <CompetitionNavbar competition={competition!} />
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
                <Tabs 
                    value={activeTab} 
                    onChange={(_, v) => {
                        if (v === "") return navigate(`/competitions/${competition.eid}`);
                        navigate(`/competitions/${competition.eid}/${v}`);
                    }} 
                    variant="scrollable" 
                    scrollButtons 
                    allowScrollButtonsMobile
                >
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
                <Route path="/events/:eventEid" element={<Event />} />
                <Route path="*" element={<Navigate to={`/competitions/${competition.eid}`} />} />
            </Routes>
        
        </>
    )
}

