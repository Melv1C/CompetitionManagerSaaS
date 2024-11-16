import { Box, CircularProgress } from '@mui/material';
import React from 'react';

const Loading: React.FC = () => {
    return (
        <Box
            sx={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                padding: '2rem'
            }}
        >
            <CircularProgress />
        </Box>
        
    );
};

export default Loading;