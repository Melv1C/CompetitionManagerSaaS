import { Loading, MaxWidth } from '@/Components';
import { useCompetition, useFetchCompetitionData } from '@/hooks';
import { Competition as CompetitionType } from '@competition-manager/schemas';
import { Box, Tab, Tabs, Typography } from '@mui/material';
import { useEffect, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import {
    Navigate,
    Route,
    Routes,
    useLocation,
    useNavigate,
    useParams,
} from 'react-router-dom';

import { Event } from './Event';
import { Inscription } from './Inscription';
import { Inscriptions } from './Inscriptions';
import { Overview } from './Overview';
import { Schedule } from './Schedule';

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

    const { competition, isLoading, reset } =
        useFetchCompetitionData(competitionEid);

    useEffect(() => {
        return () => {
            reset();
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    if (isLoading) return <Loading />;

    return (
        <MaxWidth>
            <Typography variant="h4" textAlign="center">
                {competition!.name}
            </Typography>
            <CompetitionNavbar competition={competition!} />
        </MaxWidth>
    );
};

type CompetitionNavbarProps = {
    competition: CompetitionType;
};

const CompetitionNavbar: React.FC<CompetitionNavbarProps> = ({
    competition,
}) => {
    const { t } = useTranslation();
    const navigate = useNavigate();
    const location = useLocation();
    const { isFuture, isCurrent } = useCompetition();

    const activeTab = useMemo(
        () =>
            extract(
                location.pathname.replace(
                    `/competitions/${competition.eid}`,
                    ''
                )
            ) || '',
        [location.pathname, competition.eid]
    );

    return (
        <>
            <Box sx={{ display: 'flex', justifyContent: 'center', mb: 2 }}>
                <Tabs
                    value={activeTab}
                    onChange={(_, v) => {
                        if (v === '')
                            return navigate(`/competitions/${competition.eid}`);
                        navigate(`/competitions/${competition.eid}/${v}`);
                    }}
                    variant="scrollable"
                    scrollButtons
                    allowScrollButtonsMobile
                >
                    <Tab label={t('navigation:overview')} value="" />
                    {isFuture && (
                        <Tab
                            label={t('navigation:register')}
                            value="register"
                        />
                    )}
                    <Tab label={t('navigation:schedule')} value="schedule" />
                    {(isFuture || isCurrent) && (
                        <Tab
                            label={t('glossary:inscriptions')}
                            value="inscriptions"
                        />
                    )}
                    {/* {(isPast || isCurrent) && (
                        <Tab label={t('glossary:results')} value="results" />
                    )} */}
                </Tabs>
            </Box>

            <Routes>
                <Route path="/" element={<Overview />} />
                {isFuture && (
                    <Route path="/register" element={<Inscription />} />
                )}
                <Route path="/schedule" element={<Schedule />} />
                {(isFuture || isCurrent) && (
                    <Route path="/inscriptions" element={<Inscriptions />} />
                )}
                {/* {(isPast || isCurrent) && (
                    <Route path="/results" element={<Box>Results</Box>} />
                )} */}
                <Route path="/events/:eventEid" element={<Event />} />
                <Route
                    path="*"
                    element={
                        <Navigate to={`/competitions/${competition.eid}`} />
                    }
                />
            </Routes>
        </>
    );
};
