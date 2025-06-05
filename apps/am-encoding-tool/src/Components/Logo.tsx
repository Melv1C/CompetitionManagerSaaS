import { Box, SxProps } from '@mui/material';
import React from 'react';

import logoWhite from '../assets/LogoWhite.png';
import logoBlack from '../assets/LogoBlack.png';

type LogoProps = {
    color?: 'white' | 'black';
    sx?: SxProps;
}

export const Logo: React.FC<LogoProps> = ({ 
    color = 'white',
    sx
}) => {
    return (
        <Box 
            sx={{ 
                display: 'flex', 
                justifyContent: 'center', 
                alignItems: 'center',
                backgroundColor: 'transparent',

                ...sx
            }}
        >
            <img src={color === 'white' ? logoWhite : logoBlack} alt="Logo" style={{ width: '100%', height: '100%'}} />
        </Box>
    );
};