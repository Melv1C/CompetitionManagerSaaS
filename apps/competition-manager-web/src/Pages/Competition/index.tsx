import { Box, Tab, Tabs, Typography } from "@mui/material";
import { useTranslation } from "react-i18next";
import { Navigate, Route, Routes, useLocation, useNavigate, useParams } from "react-router-dom";
import { competitionAtom, inscriptionsAtom } from "../../GlobalsStates";
import { useAtom } from "jotai";
import { useQuery } from "react-query";
import { getCompetition, getInscriptions } from "../../api";
import { Loading, MaxWidth } from "../../Components";
import { useEffect, useState } from "react";

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

    const { t } = useTranslation();

    const [globalComp, setCompetition] = useAtom(competitionAtom);
    const [globalInscriptions, setInscriptions] = useAtom(inscriptionsAtom);
    const { eid } = useParams();

    const navigate = useNavigate();

    const location = useLocation();

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

    const [activeTab, setActiveTab] = useState(extract(location.pathname.replace(`/competitions/${eid}`, '')) || '/');

    if (isCompetitionError) throw new Error('Error while fetching competition');
    if (isInscriptionsError) throw new Error('Error while fetching inscriptions');

    if (isLoading || !isLoaded) return <Loading />;

    return (
        <MaxWidth>
            <Typography variant="h4" textAlign='center'>{globalComp.name}</Typography>

            <Box sx={{ display: 'flex', justifyContent: 'center', mb: 2 }}>
                <Tabs value={activeTab} onChange={(_, v) => {
                    setActiveTab(v);
                    if (v === "") return navigate(`/competitions/${eid}`);
                    navigate(`/competitions/${eid}/${v}`);
                }} variant="scrollable" scrollButtons allowScrollButtonsMobile>
                    <Tab label={t('navigation:overview')} value="" />
                    <Tab label={t('navigation:register')} value="register" />
                    <Tab label={t('navigation:schedule')} value="schedule" />
                    <Tab label={t('glossary:inscriptions')} value="inscriptions" />
                    <Tab label={t('glossary:results')} value="results" />
                </Tabs>
            </Box>
            
            <Routes>
                <Route path="/" element={<Box>{globalComp.name}</Box>} />
                <Route path="/register" element={<Box>{t('navigation:register')}</Box>} />
                <Route path="/schedule" element={<Box>{t('navigation:schedule')}</Box>} />
                <Route path="/inscriptions" element={<Box>{t('glossary:inscriptions')}</Box>} />
                <Route path="/results" element={<Box>{t('glossary:results')}</Box>} />
                <Route path="*" element={<Navigate to={`/competitions/${eid}`} />} />
            </Routes>
        </MaxWidth>
    )
}
