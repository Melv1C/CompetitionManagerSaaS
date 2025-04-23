import { Loading, SideNav } from '@/Components';
import { useFetchCompetitionData } from '@/hooks';
import { CLOSED_SIDENAV_WIDTH, OPEN_SIDENAV_WIDTH } from '@/utils/constants';
import {
    faBasketShopping,
    faChartLine,
    faClock,
    faGears,
    faInfo,
    faTrophy,
    faUserCheck,
    faUsers,
    faUsersGear,
} from '@fortawesome/free-solid-svg-icons';
import { Box } from '@mui/material';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Route, Routes, useParams } from 'react-router-dom';
import { Confirmations } from './Confirmations';
import { Info } from './Info';
import { Inscriptions } from './Inscriptions';
import { Results } from './Results';
import { Schedule } from './Schedule';
import { Stats } from './Stats';

export const AdminCompetition = () => {
    const { competitionEid } = useParams();
    if (!competitionEid) throw new Error('No competition EID provided');

    const { t } = useTranslation();

    const { isLoading, reset } = useFetchCompetitionData(competitionEid, true);

    const [isSideNavOpen, setIsSideNavOpen] = useState(false);

    const navItems = [
        {
            text: t('navigation:info'),
            icon: faInfo,
            link: `/admin/competitions/${competitionEid}`,
        },
        {
            text: t('navigation:schedule'),
            icon: faClock,
            link: `/admin/competitions/${competitionEid}/schedule`,
        },
        {
            text: t('glossary:inscriptions'),
            icon: faUsers,
            link: `/admin/competitions/${competitionEid}/inscriptions`,
        },
        {
            text: t('glossary:confirmations'),
            icon: faUserCheck,
            link: `/admin/competitions/${competitionEid}/confirmations`,
        },
        {
            text: t('glossary:results'),
            icon: faTrophy,
            link: `/admin/competitions/${competitionEid}/results`,
        },
        {
            text: t('navigation:stats'),
            icon: faChartLine,
            link: `/admin/competitions/${competitionEid}/stats`,
        },
        {
            text: t('navigation:admins'),
            icon: faUsersGear,
            link: `/admin/competitions/${competitionEid}/admins`,
        },
        {
            text: t('navigation:options'),
            icon: faBasketShopping,
            link: `/admin/competitions/${competitionEid}/options`,
        },
        {
            text: t('navigation:settings'),
            icon: faGears,
            link: `/admin/competitions/${competitionEid}/settings`,
        },
    ];

    useEffect(() => {
        return () => {
            reset();
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    return (
        <Box sx={{ display: 'flex' }}>
            <SideNav
                items={navItems}
                isMenuOpen={isSideNavOpen}
                setIsMenuOpen={setIsSideNavOpen}
            />
            <Box
                sx={{
                    width: `calc(100% - ${
                        isSideNavOpen
                            ? OPEN_SIDENAV_WIDTH
                            : CLOSED_SIDENAV_WIDTH
                    })`,
                    transition: 'width 0.3s',
                    py: 2,
                }}
            >
                {isLoading ? (
                    <Loading />
                ) : (
                    <Routes>
                        <Route path="/" element={<Info />} />
                        <Route path="/schedule" element={<Schedule />} />
                        <Route
                            path="/inscriptions"
                            element={<Inscriptions />}
                        />
                        <Route
                            path="/confirmations"
                            element={<Confirmations />}
                        />
                        <Route path="/results" element={<Results />} />
                        <Route path="/stats" element={<Stats />} />
                        <Route path="/admins" element={<Box>admins</Box>} />
                        <Route path="/options" element={<Box>options</Box>} />
                        <Route path="/settings" element={<Box>settings</Box>} />
                    </Routes>
                )}
            </Box>
        </Box>
    );
};
