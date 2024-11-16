import { Box, Card, CardActionArea, CardContent, Chip, Typography } from '@mui/material'
import { Date } from './Date'
import { Competition } from '../../type'
import { useNavigate } from 'react-router-dom'

type ItemProps = {
    competition: Competition;
}

export const Item: React.FC<ItemProps> = ({ competition }) => {
    const navigate = useNavigate();

    return (
        <Card>
            <CardActionArea onClick={() => {
                navigate(`/admin/competitions/${competition.id}`);
            }}>
                <CardContent>
                    <Box sx={{ display: 'flex', flexDirection: 'row', gap: '1rem' }}>
                        <Date date={competition.date} />
                        <Box sx={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                            <Typography variant="h6" color='primary'>
                                {competition.name}
                            </Typography>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                <Chip label={competition.club} color='secondary' />
                                <Typography variant="body1" color='secondary'>
                                    {competition.address}
                                </Typography>
                            </Box>
                        </Box>
                    </Box>
                </CardContent>
            </CardActionArea>
        </Card>
    )
}
