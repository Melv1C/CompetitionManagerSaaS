import { useNavigate } from 'react-router-dom'
import { Alert, Box, Card, CardActionArea, Chip, List, ListItem, ListItemAvatar, ListItemText, Typography } from '@mui/material'

import { DisplayCompetition } from '@competition-manager/schemas'
import { Date } from './Date'
import { useTranslation } from 'react-i18next'

type ListProps = {
    isPast: boolean
    competitions: DisplayCompetition[]
    link?: string
}

export const ListCompetitions: React.FC<ListProps> = ({ isPast, competitions, link = '/competitions' }) => {

    const { t } = useTranslation();

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
            {competitions.length === 0 && (
                <Alert severity="info">
                    {t('glossary:noCompetitions')}
                </Alert>
            )}
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
                                            secondary={(competition.club || competition.location) && (
                                                <Box sx={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                                                    {competition.club && <Chip label={competition.club.abbr} color="primary" />}
                                                    {competition.location && <Typography variant="body2">{competition.location}</Typography>}
                                                </Box>
                                            )}
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
