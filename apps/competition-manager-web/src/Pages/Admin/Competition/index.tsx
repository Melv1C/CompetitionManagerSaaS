import { useEffect, useState } from "react";
import { Box } from "@mui/material";
import { Route, Routes, useParams } from "react-router-dom";
import { useQuery } from "react-query";
import { getCompetition, getInscriptions } from "../../../api";
import { faBasketShopping, faClock, faGears, faInfo, faRankingStar, faUsersGear } from "@fortawesome/free-solid-svg-icons";
import { Info } from "./Info";
import { useAtom } from "jotai";
import { competitionAtom, inscriptionsAtom } from "../../../GlobalsStates";
import { CLOSED_SIDENAV_WIDTH, OPEN_SIDENAV_WIDTH } from "../../../utils/constants";
import { Loading, ScrollablePage, SideNav } from "../../../Components";
import { Schedule } from "./Schedule";
import { useTranslation } from "react-i18next";


export const AdminCompetition = () => {

    const { t } = useTranslation();

    const [globalComp, setCompetition] = useAtom(competitionAtom);
    const [globalInscriptions, setInscriptions] = useAtom(inscriptionsAtom);
    const { eid } = useParams();

    if (!eid) throw new Error('No competition ID provided');

    const { data: competition, isLoading: isCompetitionLoading, isError: isCompetitionError } = useQuery(['competition', eid], () => getCompetition(eid, true));
    const { data: inscriptions, isLoading: isInscriptionsLoading, isError: isInscriptionsError } = useQuery(['inscriptions', eid], () => getInscriptions(eid));
    const isLoading = isCompetitionLoading || isInscriptionsLoading;
    const isLoaded = globalComp && globalInscriptions;

    const [isSideNavOpen, setIsSideNavOpen] = useState(false);

    const navItems = [
        { text: t('navigation:info'), icon: faInfo, link: `/admin/competitions/${eid}` },
        { text: t('navigation:schedule'), icon: faClock, link: `/admin/competitions/${eid}/schedule` },
        { text: t('glossary:results'), icon: faRankingStar, link: `/admin/competitions/${eid}/results` },
        { text: t('navigation:admins'), icon: faUsersGear, link: `/admin/competitions/${eid}/admins` },
        { text: t('navigation:options'), icon: faBasketShopping, link: `/admin/competitions/${eid}/options` },
        { text: t('navigation:settings'), icon: faGears, link: `/admin/competitions/${eid}/settings` },
    ];

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
    
    return (
        <ScrollablePage>
            <SideNav items={navItems} isMenuOpen={isSideNavOpen} setIsMenuOpen={setIsSideNavOpen} />
            <Box
                sx={{
                    width: `calc(100% - ${isSideNavOpen ? OPEN_SIDENAV_WIDTH : CLOSED_SIDENAV_WIDTH})`,
                    transition: 'width 0.3s',
                }}
            >
                {(isLoading || !isLoaded) ? <Loading /> :
                    <Routes>
                        <Route path="/" element={<Info />} />
                        <Route path="/schedule" element={<Schedule />} />
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
