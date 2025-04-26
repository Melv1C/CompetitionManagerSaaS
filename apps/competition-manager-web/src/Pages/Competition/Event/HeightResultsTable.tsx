import { AttemptValue, EventType, Result } from '@competition-manager/schemas';
import { formatPerf, formatResult } from '@competition-manager/utils';
import {
    Box,
    Paper,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Typography,
} from '@mui/material';
import { useTranslation } from 'react-i18next';

interface HeightResultsTableProps {
    results: Result[];
}

// Component that renders a single attempt circle with color coded status
const AttemptCircle = ({ attempt }: { attempt: AttemptValue | undefined }) => {
    if (!attempt) return <Box component="span" sx={{ width: 24 }}></Box>;

    switch (attempt) {
        case AttemptValue.O:
            return (
                <Typography variant="body2" color="success.main">
                    {AttemptValue.O}
                </Typography>
            );
        case AttemptValue.X:
            return (
                <Typography variant="body2" color="error.main">
                    {AttemptValue.X}
                </Typography>
            );
        case AttemptValue.PASS:
            return (
                <Typography
                    variant="body2"
                    color="text.secondary"
                    sx={{ fontWeight: 'bold' }}
                >
                    {AttemptValue.PASS}
                </Typography>
            );
        default:
            <Typography variant="body2" color="text.secondary">
                {attempt}
            </Typography>;
    }
};

export const HeightResultsTable = ({ results }: HeightResultsTableProps) => {
    const { t } = useTranslation();

    // Group all heights from all athletes' details
    const allHeights = new Set<number>();
    results.forEach((result) => {
        if (result.details) {
            result.details.forEach((detail) => {
                allHeights.add(detail.tryNumber);
            });
        }
    });

    // Sort heights in ascending order
    const sortedHeights = [...allHeights].sort((a, b) => a - b);

    return (
        <TableContainer component={Paper}>
            <Table size="small" sx={{ minWidth: 650 }}>
                <TableHead>
                    <TableRow>
                        <TableCell>
                            {t('competition:results.position')}
                        </TableCell>
                        <TableCell>{t('competition:results.bib')}</TableCell>
                        <TableCell>
                            {t('competition:results.athlete')}
                        </TableCell>
                        <TableCell>{t('competition:results.club')}</TableCell>
                        <TableCell align="right">
                            {t('competition:results.height')}
                        </TableCell>
                        {sortedHeights.map((height) => (
                            <TableCell key={height} align="center">
                                {formatPerf(height, EventType.HEIGHT)}
                            </TableCell>
                        ))}
                    </TableRow>
                </TableHead>
                <TableBody>
                    {results.map((result, index) => (
                        <TableRow key={result.id}>
                            <TableCell>{index + 1}</TableCell>
                            <TableCell>{result.bib}</TableCell>
                            <TableCell>{`${result.athlete.firstName} ${result.athlete.lastName}`}</TableCell>
                            <TableCell>{result.club.abbr}</TableCell>
                            <TableCell align="right">
                                {formatResult(result)}
                            </TableCell>
                            {sortedHeights.map((height) => {
                                const detailForHeight = result.details?.find(
                                    (d) => d.tryNumber === height
                                );

                                return (
                                    <TableCell
                                        key={`${result.id}-${height}`}
                                        align="center"
                                    >
                                        {detailForHeight ? (
                                            <Box
                                                sx={{
                                                    display: 'flex',
                                                    justifyContent: 'center',
                                                    gap: 0.5,
                                                }}
                                            >
                                                {detailForHeight.attempts.map(
                                                    (attempt) => (
                                                        <Box component="span">
                                                            <AttemptCircle
                                                                attempt={
                                                                    attempt
                                                                }
                                                            />
                                                        </Box>
                                                    )
                                                )}
                                            </Box>
                                        ) : null}
                                    </TableCell>
                                );
                            })}
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </TableContainer>
    );
};
