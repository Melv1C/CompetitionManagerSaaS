import { Box, Typography } from '@mui/material'
import { Item } from './Item'
import { Competition } from '../../type'

type ListProps = {
    isPast: boolean
    competitions: Competition[]
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

    return (
        <Box 
            sx={{ 
                display: 'flex', 
                flexDirection: 'column',
                gap: '1rem',
                margin: '1rem',
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
                        <Item key={competition.id} competition={competition} link={link} />
                    ))}
                </Box>
            ))}
        </Box>
    )
}
