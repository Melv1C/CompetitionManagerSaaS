

import { Box, Typography } from "@mui/material"
import { SideNav } from "../../Components/SideNav";
import { faList, faNewspaper, faReceipt } from "@fortawesome/free-solid-svg-icons";
import { Navigate, Route, Routes } from "react-router-dom";
import { Offers } from "./Offers";
import { CLOSED_SIDENAV_WIDTH, OPEN_SIDENAV_WIDTH } from "../../utils/constants";
import { useState } from "react";
import { Logs } from "./Logs";
import { News } from "./News";

const MenuItems = [
    { text: 'News', icon: faNewspaper, link: '/superadmin/news' },
    { text: 'Logs', icon: faList, link: '/superadmin/logs' },
    { text: 'Offers', icon: faReceipt, link: '/superadmin/offers' },
]

export const SuperAdmin = () => {

    const [isMenuOpen, setIsMenuOpen] = useState(false);

    return (
        <Box
            sx={{
                display: 'flex',
                width: '100%',
            }}
        >
            <SideNav items={MenuItems} isMenuOpen={isMenuOpen} setIsMenuOpen={setIsMenuOpen} />
            <Box
                sx={{
                    width: `calc(100% - ${isMenuOpen ? OPEN_SIDENAV_WIDTH : CLOSED_SIDENAV_WIDTH})`,
                    transition: 'width 0.3s',
                }}
            >
                <Routes>
                    <Route path="/" element={<Typography variant="h4">SuperAdmin</Typography>} />
                    <Route path="/news" element={<News />} />
                    <Route path="/logs" element={<Logs />} />
                    <Route path="/offers" element={<Offers />} />
                    <Route path="*" element={<Navigate to="/" />} />
                </Routes>
            </Box>
        </Box>
    )
}
