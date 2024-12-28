

import { Box, Typography } from "@mui/material"
import { SideNav } from "../../Components/SideNav";
import { faReceipt } from "@fortawesome/free-solid-svg-icons";
import { Route, Routes } from "react-router-dom";

const MenuItems = [
    { text: 'Offers', icon: faReceipt, link: '/superadmin/offers' },
]

export const SuperAdmin = () => {

    return (
        <Box
            sx={{
                display: 'flex'
            }}
        >
            <SideNav items={MenuItems} />
            <Routes>
                <Route path="/" element={<Typography variant="h4">SuperAdmin</Typography>} />
                <Route path="/offers" element={<Typography variant="h4">Offers</Typography>} />
            </Routes>
        </Box>
    )
}
