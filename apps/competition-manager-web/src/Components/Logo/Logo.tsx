import { Box } from '@mui/material';

export const Logo: React.FC = () => {
    return (
        <Box 
            sx={{ 
                display: 'flex', 
                justifyContent: 'center', 
                alignItems: 'center',
                backgroundColor: 'primary.main',
                color: 'primary.main',
                width: '4rem',
                height: '3rem',
            }}
        >
            <img src="./LogoBlack.png" alt="Logo" style={{ width: '100%', height: '100%'}} />
        </Box>
    );
};