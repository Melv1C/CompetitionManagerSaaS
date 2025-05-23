import { Loading, SideNav } from '@/Components';
import { competitionAtom, userTokenAtom } from '@/GlobalsStates';
import { useFetchCompetitionData } from '@/hooks';
import { CLOSED_SIDENAV_WIDTH, OPEN_SIDENAV_WIDTH } from '@/utils/constants';
import { Access, Role } from '@competition-manager/schemas';
import {
    faChartLine,
    faClock,
    faInfo,
    faTrophy,
    faUserCheck,
    faUsers,
    faUsersGear,
} from '@fortawesome/free-solid-svg-icons';
import { Box } from '@mui/material';
import { useAtomValue } from 'jotai';
import { useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Route, Routes, useParams } from 'react-router-dom';
import { Admins } from './Admins';
import { Confirmations } from './Confirmations';
import { Info } from './Info';
import { Inscriptions } from './Inscriptions';
import { Results } from './Results';
import { Schedule } from './Schedule';
import { Stats } from './Stats';

export const AdminCompetition = () => {
    const { competitionEid } = useParams();
    if (!competitionEid) throw new Error('No competition EID provided');

    const userToken = useAtomValue(userTokenAtom);
    const competition = useAtomValue(competitionAtom);
    if (!competition) throw new Error('No competition found in state');

    const { t } = useTranslation();

    const { isLoading, reset } = useFetchCompetitionData(competitionEid, true);

    const [isSideNavOpen, setIsSideNavOpen] = useState(false);

    // Find the current user's admin access in this competition
    const currentUserAdminAccess = useMemo(() => {
        if (!userToken || userToken === 'NOT_LOGGED' || !competition.admins) {
            return null;
        }

        // Find the current user in the competition's admins array
        const adminEntry = competition.admins.find(
            (admin) => admin.userId === userToken.id
        );
        return adminEntry?.access || null;
    }, [userToken, competition.admins]);

    const allNavItems = useMemo(() => {
        return [
            {
                text: t('navigation:info'),
                icon: faInfo,
                link: `/admin/competitions/${competitionEid}`,
                accesses: [Access.OWNER, Access.COMPETITIONS],
            },
            {
                text: t('navigation:schedule'),
                icon: faClock,
                link: `/admin/competitions/${competitionEid}/schedule`,
                accesses: [Access.OWNER, Access.COMPETITIONS],
            },
            {
                text: t('glossary:inscriptions'),
                icon: faUsers,
                link: `/admin/competitions/${competitionEid}/inscriptions`,
                accesses: [Access.OWNER, Access.INSCRIPTIONS],
            },
            {
                text: t('glossary:confirmations'),
                icon: faUserCheck,
                link: `/admin/competitions/${competitionEid}/confirmations`,
                accesses: [Access.OWNER, Access.CONFIRMATIONS],
            },
            {
                text: t('glossary:results'),
                icon: faTrophy,
                link: `/admin/competitions/${competitionEid}/results`,
                accesses: [Access.OWNER, Access.RESULTS],
            },
            {
                text: t('navigation:stats'),
                icon: faChartLine,
                link: `/admin/competitions/${competitionEid}/stats`,
                accesses: [Access.OWNER, Access.COMPETITIONS],
            },
            {
                text: t('navigation:admins'),
                icon: faUsersGear,
                link: `/admin/competitions/${competitionEid}/admins`,
                accesses: [Access.OWNER, Access.COMPETITIONS],
            },
        ];
    }, [t, competitionEid]);

    // Filter nav items based on the user's admin access in this competition
    const navItems = useMemo(() => {
        // Always allow SUPERADMIN to see everything
        if (
            userToken &&
            userToken !== 'NOT_LOGGED' &&
            userToken.role === Role.SUPERADMIN
        ) {
            return allNavItems.map(({ text, icon, link }) => ({
                text,
                icon,
                link,
            }));
        }

        // If user has a specific admin access for this competition, filter based on that
        if (currentUserAdminAccess) {
            return allNavItems
                .filter((item) =>
                    // Check if one of the item's accesses matches the user's access
                    item.accesses.some((access) =>
                        currentUserAdminAccess.includes(access)
                    )
                )
                .map(({ text, icon, link }) => ({ text, icon, link }));
        }

        // If user is not an admin for this competition, return empty array
        return [];
    }, [allNavItems, userToken, currentUserAdminAccess]);

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
                        <Route path="/admins" element={<Admins />} />
                    </Routes>
                )}
            </Box>
        </Box>
    );
};
