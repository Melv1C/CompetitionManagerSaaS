import {
    faArrowDown,
    faArrowUp,
    faChartLine,
    faDollarSign,
    faUsers,
} from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
    Box,
    Card,
    CardContent,
    Grid,
    Typography,
    useTheme,
} from '@mui/material';
import {
    BarChart,
    BarPlot,
    ChartsTooltip,
    ChartsXAxis,
    ChartsYAxis,
    LineChart,
    LinePlot,
} from '@mui/x-charts';
import { OverviewTabProps } from '../types';

export const OverviewTab: React.FC<OverviewTabProps> = ({
    activeInscriptions,
    chartData,
    t,
    timeFrameType,
    timeFrameUnit,
}) => {
    const theme = useTheme();
    const isCumulative = timeFrameType === 'cumulative';

    // Calculate key metrics
    const totalParticipants = new Set(
        activeInscriptions.map((i) => i.athlete.id)
    ).size;
    const totalInscriptions = activeInscriptions.length;
    const totalRevenue = activeInscriptions.reduce(
        (sum, i) => sum + (i.paid || 0),
        0
    );
    const avgInscriptionsPerParticipant =
        totalParticipants > 0
            ? (totalInscriptions / totalParticipants).toFixed(1)
            : 0;
    const avgRevenuePerInscription =
        totalInscriptions > 0
            ? (totalRevenue / totalInscriptions).toFixed(2)
            : 0;

    // Last 7 days trend
    const today = new Date();
    const sevenDaysAgo = new Date(today);
    sevenDaysAgo.setDate(today.getDate() - 7);

    const recentInscriptions = activeInscriptions.filter(
        (i) => i.date > sevenDaysAgo
    );
    const recentChange =
        recentInscriptions.length > 0
            ? (recentInscriptions.length / totalInscriptions) * 100
            : 0;

    // Format dates based on time frame unit for use as chart labels
    const formattedLabels = chartData.map((d) => {
        if (timeFrameUnit === 'hourly') {
            return `${d.date.toLocaleDateString()} ${d.date.getHours()}:00`;
        } else if (timeFrameUnit === 'weekly') {
            return `${t(
                'adminCompetition:week'
            )} ${d.date.toLocaleDateString()}`;
        }
        return d.date.toLocaleDateString();
    });

    return (
        <Grid container spacing={3}>
            {/* Key Metric Cards - Row 1 */}
            <Grid item xs={12} md={4}>
                <Card
                    elevation={2}
                    sx={{
                        height: '100%',
                        background: `linear-gradient(45deg, ${theme.palette.primary.main}22, ${theme.palette.primary.light}33)`,
                        border: `1px solid ${theme.palette.primary.main}22`,
                        transition: 'transform 0.3s',
                        '&:hover': { transform: 'translateY(-4px)' },
                    }}
                >
                    <CardContent>
                        <Box
                            display="flex"
                            alignItems="center"
                            mb={1}
                            justifyContent="space-between"
                        >
                            <Typography variant="h6" fontWeight="medium">
                                {t('adminCompetition:participants')}
                            </Typography>
                            <Box
                                bgcolor={theme.palette.primary.main}
                                borderRadius="50%"
                                p={1}
                                display="flex"
                            >
                                <FontAwesomeIcon
                                    icon={faUsers}
                                    style={{ color: 'white' }}
                                />
                            </Box>
                        </Box>
                        <Typography
                            variant="h3"
                            color="primary"
                            fontWeight="bold"
                        >
                            {totalParticipants}
                        </Typography>
                        <Box display="flex" alignItems="center" mt={1}>
                            <Box
                                display="flex"
                                alignItems="center"
                                px={1}
                                py={0.5}
                                borderRadius={1}
                                bgcolor={
                                    recentChange > 0
                                        ? 'success.light'
                                        : 'error.light'
                                }
                                mr={1}
                            >
                                {recentChange > 0 ? (
                                    <FontAwesomeIcon
                                        icon={faArrowUp}
                                        fontSize="small"
                                        style={{
                                            color: theme.palette.success.dark,
                                        }}
                                    />
                                ) : (
                                    <FontAwesomeIcon
                                        icon={faArrowDown}
                                        fontSize="small"
                                        style={{
                                            color: theme.palette.error.dark,
                                        }}
                                    />
                                )}
                                <Typography
                                    variant="body2"
                                    fontWeight="medium"
                                    color={
                                        recentChange > 0
                                            ? 'success.dark'
                                            : 'error.dark'
                                    }
                                >
                                    {recentChange.toFixed(1)}%
                                </Typography>
                            </Box>
                            <Typography variant="body2" color="text.secondary">
                                {t('adminCompetition:lastSevenDays')}
                            </Typography>
                        </Box>
                    </CardContent>
                </Card>
            </Grid>

            <Grid item xs={12} md={4}>
                <Card
                    elevation={2}
                    sx={{
                        height: '100%',
                        background: `linear-gradient(45deg, ${theme.palette.warning.main}22, ${theme.palette.warning.light}33)`,
                        border: `1px solid ${theme.palette.warning.main}22`,
                        transition: 'transform 0.3s',
                        '&:hover': { transform: 'translateY(-4px)' },
                    }}
                >
                    <CardContent>
                        <Box
                            display="flex"
                            alignItems="center"
                            mb={1}
                            justifyContent="space-between"
                        >
                            <Typography variant="h6" fontWeight="medium">
                                {t('adminCompetition:inscriptions')}
                            </Typography>
                            <Box
                                bgcolor={theme.palette.warning.main}
                                borderRadius="50%"
                                p={1}
                                display="flex"
                            >
                                <FontAwesomeIcon
                                    icon={faUsers}
                                    style={{ color: 'white' }}
                                />
                            </Box>
                        </Box>
                        <Typography
                            variant="h3"
                            color="warning.main"
                            fontWeight="bold"
                        >
                            {totalInscriptions}
                        </Typography>
                        <Box display="flex" alignItems="center" mt={1}>
                            <Typography
                                variant="body1"
                                fontWeight="medium"
                                mr={1}
                            >
                                {avgInscriptionsPerParticipant}
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                                {t('adminCompetition:perParticipant')}
                            </Typography>
                        </Box>
                    </CardContent>
                </Card>
            </Grid>

            <Grid item xs={12} md={4}>
                <Card
                    elevation={2}
                    sx={{
                        height: '100%',
                        background: `linear-gradient(45deg, ${theme.palette.success.main}22, ${theme.palette.success.light}33)`,
                        border: `1px solid ${theme.palette.success.main}22`,
                        transition: 'transform 0.3s',
                        '&:hover': { transform: 'translateY(-4px)' },
                    }}
                >
                    <CardContent>
                        <Box
                            display="flex"
                            alignItems="center"
                            mb={1}
                            justifyContent="space-between"
                        >
                            <Typography variant="h6" fontWeight="medium">
                                {t('adminCompetition:revenue')}
                            </Typography>
                            <Box
                                bgcolor={theme.palette.success.main}
                                borderRadius="50%"
                                p={1}
                                display="flex"
                            >
                                <FontAwesomeIcon
                                    icon={faDollarSign}
                                    style={{ color: 'white' }}
                                />
                            </Box>
                        </Box>
                        <Typography
                            variant="h3"
                            color="success.main"
                            fontWeight="bold"
                        >
                            {totalRevenue}€
                        </Typography>
                        <Box display="flex" alignItems="center" mt={1}>
                            <FontAwesomeIcon
                                icon={faChartLine}
                                fontSize="small"
                                style={{
                                    color: theme.palette.text.secondary,
                                    marginRight: theme.spacing(1),
                                }}
                            />
                            <Typography variant="body2" color="text.secondary">
                                {avgRevenuePerInscription}€{' '}
                                {t('adminCompetition:perInscription')}
                            </Typography>
                        </Box>
                    </CardContent>
                </Card>
            </Grid>

            {/* Charts Row */}
            <Grid item xs={12}>
                <Card elevation={2} sx={{ height: '100%', minHeight: 380 }}>
                    <CardContent>
                        <Typography variant="h6" gutterBottom>
                            {t('adminCompetition:inscriptionsOverTime')}
                        </Typography>
                        <Box sx={{ height: 320, width: '100%' }}>
                            {isCumulative ? (
                                <LineChart
                                    series={[
                                        {
                                            data: chartData.map(
                                                (d) => d.revenue
                                            ),
                                            label: t(
                                                'adminCompetition:revenue'
                                            ),
                                            color: theme.palette.success.main,
                                            valueFormatter: (value) =>
                                                `${value}€`,
                                            showMark: false,
                                        },
                                        {
                                            data: chartData.map(
                                                (d) => d.participants
                                            ),
                                            label: t(
                                                'adminCompetition:participants'
                                            ),
                                            color: theme.palette.info.main,
                                            valueFormatter: (value) =>
                                                `${value}`,
                                            showMark: false,
                                        },
                                    ]}
                                    xAxis={[
                                        {
                                            data: chartData.map((d) => d.date),
                                            scaleType: 'time',
                                            valueFormatter: (date) =>
                                                date.toLocaleDateString(),
                                        },
                                    ]}
                                    sx={{ width: '100%', height: '100%' }}
                                >
                                    <LinePlot />
                                    <ChartsTooltip />
                                    <ChartsXAxis />
                                    <ChartsYAxis />
                                </LineChart>
                            ) : (
                                <BarChart
                                    series={[
                                        {
                                            data: chartData.map(
                                                (d) => d.revenue
                                            ),
                                            label: t(
                                                'adminCompetition:revenue'
                                            ),
                                            color: theme.palette.success.main,
                                            valueFormatter: (value) =>
                                                `${value}€`,
                                        },
                                        {
                                            data: chartData.map(
                                                (d) => d.participants
                                            ),
                                            label: t(
                                                'adminCompetition:participants'
                                            ),
                                            color: theme.palette.info.main,
                                        },
                                    ]}
                                    xAxis={[
                                        {
                                            data: formattedLabels,
                                            scaleType: 'band',
                                        },
                                    ]}
                                    sx={{ width: '100%', height: '100%' }}
                                >
                                    <BarPlot />
                                    <ChartsTooltip />
                                    <ChartsXAxis />
                                    <ChartsYAxis />
                                </BarChart>
                            )}
                        </Box>
                    </CardContent>
                </Card>
            </Grid>
        </Grid>
    );
};
