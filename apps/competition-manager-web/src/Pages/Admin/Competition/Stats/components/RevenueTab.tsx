import { Box, Card, CardContent, Typography } from '@mui/material';
import {
    AreaPlot,
    BarChart,
    BarPlot,
    ChartsTooltip,
    ChartsXAxis,
    ChartsYAxis,
    LineChart,
    LinePlot,
} from '@mui/x-charts';
import { TabProps } from '../types';

export const RevenueTab: React.FC<TabProps> = ({
    chartData,
    timeFrameType,
    timeFrameUnit,
    t,
}) => {
    const isCumulative = timeFrameType === 'cumulative';

    if (isCumulative) {
        return (
            <Card>
                <CardContent>
                    <Typography variant="h6" gutterBottom>
                        {t('adminCompetition:revenueOverTime')} (
                        {t('adminCompetition:cumulative')})
                    </Typography>
                    <Box sx={{ height: 400, width: '100%' }}>
                        <LineChart
                            series={[
                                {
                                    data: chartData.map((d) => d.revenue),
                                    label: t('adminCompetition:revenue'),
                                    color: '#ff9800',
                                    area: false,
                                    valueFormatter: (value) => `${value}€`,
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
                            yAxis={[
                                {
                                    label:
                                        t('adminCompetition:revenue') + ' (€)',
                                },
                            ]}
                            sx={{ width: '100%', height: '100%' }}
                        >
                            <LinePlot />
                            <AreaPlot />
                            <ChartsTooltip />
                            <ChartsXAxis />
                            <ChartsYAxis />
                        </LineChart>
                    </Box>
                </CardContent>
            </Card>
        );
    } else {
        // Format dates based on time frame unit for use as categories
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
            <Card>
                <CardContent>
                    <Typography variant="h6" gutterBottom>
                        {t('adminCompetition:revenueOverTime')} (
                        {t(`adminCompetition:${timeFrameUnit}`)})
                    </Typography>
                    <Box sx={{ height: 400, width: '100%' }}>
                        <BarChart
                            series={[
                                {
                                    data: chartData.map((d) => d.revenue),
                                    label: t('adminCompetition:revenue'),
                                    color: '#ff9800',
                                    valueFormatter: (value) => `${value}€`,
                                },
                            ]}
                            xAxis={[
                                {
                                    data: formattedLabels,
                                    scaleType: 'band',
                                },
                            ]}
                            yAxis={[
                                {
                                    label:
                                        t('adminCompetition:revenue') + ' (€)',
                                },
                            ]}
                            sx={{ width: '100%', height: '100%' }}
                        >
                            <BarPlot />
                            <ChartsTooltip />
                        </BarChart>
                    </Box>
                </CardContent>
            </Card>
        );
    }
};
