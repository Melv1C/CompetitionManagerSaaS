import {
    AttemptValue,
    EventType,
    ResultDetail as ResultDetailsType,
} from '@competition-manager/schemas';
import { formatPerf, formatResultDetail } from '@competition-manager/utils';
import { Box, Chip, Typography } from '@mui/material';

interface ResultDetailsProps {
    details: ResultDetailsType[];
    eventType: EventType;
}

export const ResultDetails = ({ details, eventType }: ResultDetailsProps) => {
    switch (eventType) {
        case EventType.DISTANCE:
            return <DistanceResultDetails details={details} />;
        case EventType.HEIGHT:
            return <HeightResultDetails details={details} />;
        default:
            return null;
    }
};

const DistanceResultDetails = ({
    details,
}: {
    details: ResultDetailsType[];
}) => {
    return (
        <Box
            sx={{
                display: 'flex',
                flexDirection: 'row',
                flexWrap: 'wrap',
                gap: 1,
                justifyContent: 'center',
            }}
        >
            {details.map((detail) => (
                <Chip
                    key={detail.id}
                    label={
                        <Box
                            sx={{
                                display: 'flex',
                                flexDirection: 'column',
                                alignItems: 'center',
                            }}
                        >
                            <Typography variant="body1">
                                {detail.value !== undefined &&
                                detail.value !== null
                                    ? formatResultDetail(
                                          detail,
                                          EventType.DISTANCE
                                      )
                                    : '-'}
                            </Typography>
                            {detail.wind !== undefined &&
                                detail.wind !== null && (
                                    <Typography
                                        variant="caption"
                                        color="text.secondary"
                                    >
                                        {`Wind: ${detail.wind} m/s`}
                                    </Typography>
                                )}
                        </Box>
                    }
                    color="primary"
                    sx={{
                        height: 'auto',
                        '& .MuiChip-label': {
                            display: 'block',
                            whiteSpace: 'normal',
                        },
                        padding: 1,
                        border: detail.isBest ? `2px solid` : `1px solid`,
                    }}
                    variant="outlined"
                />
            ))}
        </Box>
    );
};

const HeightResultDetails = ({ details }: { details: ResultDetailsType[] }) => {
    return (
        <Box
            sx={{
                display: 'flex',
                flexDirection: 'row',
                flexWrap: 'wrap',
                gap: 1,
                justifyContent: 'center',
            }}
        >
            {details.map((detail) => (
                <Chip
                    key={detail.id}
                    label={
                        <Box
                            sx={{
                                display: 'flex',
                                flexDirection: 'column',
                                alignItems: 'center',
                            }}
                        >
                            <Typography variant="body1">
                                {formatPerf(detail.tryNumber, EventType.HEIGHT)}
                            </Typography>
                            <Box
                                sx={{
                                    display: 'flex',
                                    flexDirection: 'row',
                                    gap: 0.5,
                                    mt: 0.5,
                                }}
                            >
                                {detail.attempts.map((attempt, index) => (
                                    <Typography
                                        key={index}
                                        variant="body2"
                                        sx={{
                                            fontWeight: 'bold',
                                            color:
                                                attempt === AttemptValue.X
                                                    ? 'error.main'
                                                    : attempt === AttemptValue.O
                                                    ? 'success.main'
                                                    : 'text.secondary',
                                        }}
                                    >
                                        {attempt}
                                    </Typography>
                                ))}
                            </Box>
                        </Box>
                    }
                    color="primary"
                    sx={{
                        height: 'auto',
                        '& .MuiChip-label': {
                            display: 'block',
                            whiteSpace: 'normal',
                        },
                        padding: 1,
                        border: detail.isBest ? `2px solid` : `1px solid`,
                    }}
                    variant="outlined"
                />
            ))}
        </Box>
    );
};
