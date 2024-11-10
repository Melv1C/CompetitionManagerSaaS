
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUser } from '@fortawesome/free-solid-svg-icons';
import { Box } from '@mui/material';

export const AccountCircle: React.FC = () => {
    return (
        <Box 
            sx={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                width: '2rem',
                height: '2rem',
                borderRadius: '50%',
                backgroundColor: 'white',
                color: 'primary.main',
            }}
        >
            <FontAwesomeIcon icon={faUser} style={{ fontSize: '1.25rem' }} />
        </Box>
    );
};