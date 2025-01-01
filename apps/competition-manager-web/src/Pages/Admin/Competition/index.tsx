import { useEffect, useState } from "react";
import { Box } from "@mui/material";
import { Route, Routes, useParams } from "react-router-dom";
import { useQuery } from "react-query";
import { getCompetition } from "../../../api/Competition";
import { faClock, faInfo, faRankingStar, faUsersGear } from "@fortawesome/free-solid-svg-icons";
import { Info } from "./Info";
import { useSetAtom } from "jotai";
import { competitionAtom } from "../../../GlobalsStates";
import { CLOSED_SIDENAV_WIDTH, OPEN_SIDENAV_WIDTH } from "../../../utils/constants";
import { Loading, ScrollablePage, SideNav } from "../../../Components";


export const AdminCompetition = () => {
    const setCompetition = useSetAtom(competitionAtom);
    const { eid } = useParams();

    if (!eid) throw new Error('No competition ID provided');

    const { data: competition, isLoading, isError } = useQuery(['competition', eid], () => getCompetition(eid, true));
    const [isSideNavOpen, setIsSideNavOpen] = useState(false);

    const navItems = [
        { text: 'Info', icon: faInfo, link: `/admin/competitions/${eid}` },
        { text: 'Schedule', icon: faClock, link: `/admin/competitions/${eid}/schedule` },
        { text: 'Results', icon: faRankingStar, link: `/admin/competitions/${eid}/results` },
        { text: 'Admins', icon: faUsersGear, link: `/admin/competitions/${eid}/admins` },
    ];

    useEffect(() => {
        if (competition) {
            setCompetition(competition);
        }
    }, [competition, setCompetition]);

    if (isError) throw new Error('Error fetching competition');
    
    return (
        <ScrollablePage>
            <SideNav items={navItems} isMenuOpen={isSideNavOpen} setIsMenuOpen={setIsSideNavOpen} />
            <Box
                sx={{
                    width: `calc(100% - ${isSideNavOpen ? OPEN_SIDENAV_WIDTH : CLOSED_SIDENAV_WIDTH})`,
                    transition: 'width 0.3s',
                }}
            >
                {isLoading ? <Loading /> : 
                    <Routes>
                        <Route path="/" element={<Info />} />
                        <Route path="/schedule" element={<Box>schedule</Box>} />
                        <Route path="/results" element={<Box>results</Box>} />
                        <Route path="/admins" element={<Box>admins</Box>} />
                    </Routes>
                }
            </Box>
        </ScrollablePage>
    );
}
