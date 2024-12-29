import { Box, Typography } from '@mui/material'
import { Item } from './Item'
import { DisplayCompetition } from '@competition-manager/schemas'

type ListProps = {
    isPast: boolean
    competitions: DisplayCompetition[]
    link?: string
}

export const ListCompetitions: React.FC<ListProps> = ({ isPast, competitions, link = '/competitions' }) => {

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
                width: '100%',
            }}
        >
            {years.map(year => (
                <Box key={year} sx={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                    <Box
                        sx={{
                            fontSize: '2rem',
                            fontWeight: 'bold',
                            borderBottom: '2px solid',
                            borderColor: 'primary.main',
                            paddingBottom: '0.5rem',
                        }}
                    >
                        <Typography variant="h4" sx={{ fontWeight: 'bold' }}>
                            {year}
                        </Typography>
                    </Box>
                    {sortedCompetitions.filter(competition => competition.date.getFullYear() === year).map(competition => (
                        <Item key={competition.eid} competition={competition} link={link} />
                    ))}
                </Box>
            ))}
        </Box>
    )
}
