import { Box, Card, CardActionArea, CardContent, Chip, Typography } from '@mui/material'
import { Date } from './Date'
import { useNavigate } from 'react-router-dom'
import { DisplayCompetition } from '@competition-manager/schemas';

type ItemProps = {
    competition: DisplayCompetition;
    link: string;
}

export const Item: React.FC<ItemProps> = ({ competition, link }) => {
    const navigate = useNavigate();

    return (
        <Card>
            <CardActionArea onClick={() => {
                navigate(`${link}/${competition.eid}`);
            }}>
                <CardContent>
                    <Box
                        sx={{ 
                            display: 'flex', 
                            flexDirection: 'row', 
                            gap: '1rem'
                        }}
                    >
                        <Date date={competition.date} />
                        <Box sx={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                            <Typography variant="h6">
                                {competition.name}
                            </Typography>
                            {/* <Box sx={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                <Chip label={competition.club} sx={{ 
                                    backgroundColor: 'primary.light',
                                    color: '#ffffff' 
                                }} />
                                <Typography variant="body1">
                                    {competition.address}
                                </Typography>
                            </Box> */}
                        </Box>
                    </Box>
                </CardContent>
            </CardActionArea>
        </Card>
    )
}
