import { useNavigate } from 'react-router-dom'
import { Box, Card, CardActionArea, List, ListItem, ListItemAvatar, ListItemText, Typography } from '@mui/material'

import { DisplayCompetition } from '@competition-manager/schemas'
import { Date } from './Date'

type ListProps = {
    isPast: boolean
    competitions: DisplayCompetition[]
    link?: string
}

export const ListCompetitions: React.FC<ListProps> = ({ isPast, competitions, link = '/competitions' }) => {

    const navigate = useNavigate();

    const sortedCompetitions = competitions.sort((a, b) => {
        if (!isPast) {
            return a.date.getTime() - b.date.getTime()
        } else {
            return b.date.getTime() - a.date.getTime()
        }
    });

    const years = [
        ...new Set(sortedCompetitions.map(competition => competition.date.getFullYear()))
    ];

    if (competitions.length === 0) {
        return (
            <Box 
                sx={{ 
                    display: 'flex', 
                    justifyContent: 'center', 
                    alignItems: 'center', 
                    height: '100vh',
                }}
            >
                <Typography>
                    No competitions
                </Typography>
            </Box>
        )
    }

    return (
        <Box 
            sx={{ 
                display: 'flex', 
                flexDirection: 'column',
                gap: '1rem',
                width: 'calc(100% - 2rem)',
                padding: '1rem',
            }}
        >
            {years.map(year => (
                <List 
                    key={year} 
                    subheader={
                        <Typography 
                            variant="h4"
                            sx={{ 
                                borderBottom: '2px solid',
                                borderColor: 'primary.main',
                                paddingBottom: '0.5rem',
                                fontWeight: 'bold'
                            }}
                        >
                            {year}
                        </Typography>
                    }
                >
                    {sortedCompetitions
                        .filter(competition => competition.date.getFullYear() === year)
                        .map(competition => (
                            <Card 
                                key={competition.eid}
                                sx={{ 
                                    margin: '0.5rem 0',
                                }}
                            >
                                <CardActionArea 
                                    onClick={() => {
                                        navigate(`${link}/${competition.eid}`);
                                    }}
                                    sx={{
                                        padding: '0.5rem',
                                    }}
                                >
                                    <ListItem>
                                        <ListItemAvatar sx={{ marginRight: '1rem' }}>
                                            <Date date={competition.date} />
                                        </ListItemAvatar>
                                        <ListItemText
                                            primary={<Typography variant="h6">{competition.name}</Typography>}
                                            // secondary={
                                            //     <Box 
                                            //         sx={{ 
                                            //             display: 'flex', 
                                            //             flexDirection: 'column', 
                                            //             gap: '0.5rem' 
                                            //         }}
                                            //     >
                                            //         <Typography variant="body1">
                                            //             {competition.club}
                                            //         </Typography>
                                            //         <Typography variant="body1">
                                            //             {competition.address}
                                            //         </Typography>
                                            //     </Box>
                                            // }
                                        />
                                    </ListItem>
                                </CardActionArea>
                            </Card>
                        ))}
                </List>
            ))}
        </Box>
    )
}
