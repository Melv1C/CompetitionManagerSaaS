import { useState } from "react";
import { Box } from "@mui/material";
import { Route, Routes, useParams } from "react-router-dom";
import { faBasketShopping, faClock, faGears, faInfo, faTrophy, faUsers, faUsersGear } from "@fortawesome/free-solid-svg-icons";
import { Info } from "./Info";
import { CLOSED_SIDENAV_WIDTH, OPEN_SIDENAV_WIDTH } from "../../../utils/constants";
import { Loading, ScrollablePage, SideNav } from "../../../Components";
import { Schedule } from "./Schedule";
import { useTranslation } from "react-i18next";
import { useFetchCompetitionData } from "../../../hooks";
import { Inscriptions } from "./Inscriptions";


export const AdminCompetition = () => {
    const { eid } = useParams();
    if (!eid) throw new Error('No competition ID provided');
    
    const { t } = useTranslation();

    const { isLoading } = useFetchCompetitionData(eid, true);

    const [isSideNavOpen, setIsSideNavOpen] = useState(false);

    const navItems = [
        { text: t('navigation:info'), icon: faInfo, link: `/admin/competitions/${eid}` },
        { text: t('navigation:schedule'), icon: faClock, link: `/admin/competitions/${eid}/schedule` },
        { text: t('glossary:inscriptions'), icon: faUsers, link: `/admin/competitions/${eid}/inscriptions` },
        { text: t('glossary:results'), icon: faTrophy, link: `/admin/competitions/${eid}/results` },
        { text: t('navigation:admins'), icon: faUsersGear, link: `/admin/competitions/${eid}/admins` },
        { text: t('navigation:options'), icon: faBasketShopping, link: `/admin/competitions/${eid}/options` },
        { text: t('navigation:settings'), icon: faGears, link: `/admin/competitions/${eid}/settings` },
    ];
    
    return (
        <ScrollablePage>
            <SideNav items={navItems} isMenuOpen={isSideNavOpen} setIsMenuOpen={setIsSideNavOpen} />
            <Box
                sx={{
                    width: `calc(100% - ${isSideNavOpen ? OPEN_SIDENAV_WIDTH : CLOSED_SIDENAV_WIDTH})`,
                    transition: 'width 0.3s',
                }}
            >
                {(isLoading) ? <Loading /> :
                    <Routes>
                        <Route path="/" element={<Info />} />
                        <Route path="/schedule" element={<Schedule />} />
                        <Route path="/inscriptions" element={<Inscriptions />} />
                        <Route path="/results" element={<Box>results</Box>} />
                        <Route path="/admins" element={<Box>admins</Box>} />
                        <Route path="/options" element={<Box>options</Box>} />
                        <Route path="/settings" element={<Box>settings</Box>} />
                    </Routes>
                }
            </Box>
        </ScrollablePage>
    );
}
