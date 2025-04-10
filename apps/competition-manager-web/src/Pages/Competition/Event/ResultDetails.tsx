import { formatPerf } from '@/utils/formatPerf';
import {
    EventType,
    ResultDetails as ResultDetailsType,
} from '@competition-manager/schemas';
import {
    Box,
    Chip,
    Divider,
    List,
    ListItem,
    ListItemText,
    Typography,
} from '@mui/material';

interface ResultDetailsProps {
    details: ResultDetailsType[];
    eventType: EventType;
}

export const ResultDetails = ({ details, eventType }: ResultDetailsProps) => {
    if (!details || details.length === 0) {
        return <Typography>No details available</Typography>;
    }

    return (
        <List dense>
            {details.map((detail, index) => (
                <Box key={detail.id}>
                    {index > 0 && <Divider component="li" />}
                    <ListItem>
                        <ListItemText
                            primary={`Attempt ${detail.tryNumber}`}
                            secondary={
                                <Box
                                    sx={{
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: 1,
                                        flexWrap: 'wrap',
                                    }}
                                >
                                    <Typography variant="body2">
                                        {formatPerf(detail.value, eventType)}
                                    </Typography>
                                    {detail.wind !== null && (
                                        <Typography variant="body2">
                                            ({(detail.wind ?? 0).toFixed(1)}{' '}
                                            m/s)
                                        </Typography>
                                    )}
                                    {detail.attempts && (
                                        <Box sx={{ display: 'flex', gap: 0.5 }}>
                                            {detail.attempts.map(
                                                (attempt, i) => (
                                                    <Chip
                                                        key={i}
                                                        label={attempt}
                                                        size="small"
                                                        color={
                                                            attempt === 'O'
                                                                ? 'success'
                                                                : attempt ===
                                                                  'X'
                                                                ? 'error'
                                                                : 'default'
                                                        }
                                                    />
                                                )
                                            )}
                                        </Box>
                                    )}
                                    {detail.isBest && (
                                        <Chip
                                            label="Best"
                                            size="small"
                                            color="primary"
                                        />
                                    )}
                                    {detail.isOfficialBest && (
                                        <Chip
                                            label="Official Best"
                                            size="small"
                                            color="secondary"
                                        />
                                    )}
                                </Box>
                            }
                        />
                    </ListItem>
                </Box>
            ))}
        </List>
    );
};
