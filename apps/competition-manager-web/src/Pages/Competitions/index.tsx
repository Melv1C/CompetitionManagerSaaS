import { useEffect, useState } from 'react';
import { getCompetitions } from '../../api';
import { Box, Typography } from '@mui/material';
import { ListCompetitions } from '../../Components/ListCompetitions';
import { Competition } from '../../type';
import Loading from '../../Components/Loading';


const Competitions: React.FC = () => {
    const [competitions, setCompetitions] = useState<Competition[]>([]);

    useEffect(() => {
        const fetchCompetitions = async () => {
            const competitions = await getCompetitions();
            setCompetitions(competitions);
        }

        fetchCompetitions();
    }, []);

    return (
        <Box
            sx={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center'
            }}
        >
            <Typography 
                variant="h4" 
                sx={{ 
                    marginTop: '2rem',
                    color: 'secondary.main',
                }}
            >
                Compétitions
            </Typography>
            {competitions.length === 0 && <Loading />}
            <ListCompetitions competitions={competitions} isPast={false} />
        </Box>
    );
};

export default Competitions;