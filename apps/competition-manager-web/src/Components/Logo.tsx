import { Box } from '@mui/material';
import React from 'react';

import logo from '../assets/LogoWhite.png';

export const Logo: React.FC = () => {
    return (
        <Box 
            sx={{ 
                display: 'flex', 
                justifyContent: 'center', 
                alignItems: 'center',
                backgroundColor: 'transparent',
                width: '4rem',
                height: '3rem',
            }}
        >
            <img src={logo} alt="Logo" style={{ width: '100%', height: '100%'}} />
        </Box>
    );
};