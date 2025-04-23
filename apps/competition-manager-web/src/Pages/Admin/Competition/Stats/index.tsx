import { MaxWidth } from '@/Components';
import { adminInscriptionsAtom, competitionAtom } from '@/GlobalsStates';
import {
    Alert,
    Box,
    Divider,
    FormControl,
    Grid,
    InputLabel,
    MenuItem,
    Select,
    SelectChangeEvent,
    Tab,
    Tabs,
    Typography,
} from '@mui/material';
import { useAtomValue } from 'jotai';
import { useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { OverviewTab, ParticipantsTab, RevenueTab } from './components';
import { TimeFrameType, TimeFrameUnit } from './types';
import {
    getStatusColor,
    getStatusDistribution,
    prepareChartData,
} from './utils/prepareChartData';

export const Stats = () => {
    const { t } = useTranslation();
    const competition = useAtomValue(competitionAtom);
    const adminInscriptions = useAtomValue(adminInscriptionsAtom);

    if (!competition) throw new Error('No competition found');
    if (!adminInscriptions) throw new Error('No inscriptions found');

    const [timeFrameType, setTimeFrameType] =
        useState<TimeFrameType>('cumulative');
    const [timeFrameUnit, setTimeFrameUnit] = useState<TimeFrameUnit>('daily');
    const [currentTab, setCurrentTab] = useState<number>(0);

    const handleChangeTab = (
        _event: React.SyntheticEvent,
        newValue: number
    ) => {
        setCurrentTab(newValue);
    };

    const handleChangeTimeFrameType = (event: SelectChangeEvent) => {
        setTimeFrameType(event.target.value as TimeFrameType);
    };

    const handleChangeTimeFrameUnit = (event: SelectChangeEvent) => {
        setTimeFrameUnit(event.target.value as TimeFrameUnit);
    };

    // Filter active inscriptions (not deleted)
    const activeInscriptions = useMemo(
        () => adminInscriptions.filter((inscription) => !inscription.isDeleted),
        [adminInscriptions]
    );

    // Prepare data for different chart types
    const chartData = useMemo(
        () =>
            prepareChartData(activeInscriptions, timeFrameType, timeFrameUnit),
        [activeInscriptions, timeFrameType, timeFrameUnit]
    );

    // Data for status distribution pie chart
    const statusDistribution = useMemo(
        () => getStatusDistribution(activeInscriptions, t),
        [activeInscriptions, t]
    );

    // Status colors for pie chart
    const statusColors = useMemo(
        () => statusDistribution.map((item) => getStatusColor(item.id)),
        [statusDistribution]
    );

    if (activeInscriptions.length === 0) {
        return (
            <MaxWidth>
                <Alert severity="info">{t('adminCompetition:noData')}</Alert>
            </MaxWidth>
        );
    }

    return (
        <MaxWidth>
            <Typography variant="h5" gutterBottom>
                {competition.name}
            </Typography>

            <Divider sx={{ mb: 3 }} />

            <Box sx={{ mb: 3 }}>
                <Grid
                    container
                    spacing={2}
                    justifyContent="flex-end"
                    alignItems="center"
                >
                    <Grid item>
                        <FormControl
                            variant="outlined"
                            size="small"
                            sx={{ minWidth: 180 }}
                        >
                            <InputLabel id="time-frame-type-select-label">
                                {t('adminCompetition:viewType')}
                            </InputLabel>
                            <Select
                                labelId="time-frame-type-select-label"
                                value={timeFrameType}
                                label={t('adminCompetition:viewType')}
                                onChange={handleChangeTimeFrameType}
                            >
                                <MenuItem value="cumulative">
                                    {t('adminCompetition:cumulative')}
                                </MenuItem>
                                <MenuItem value="per_frame">
                                    {t('adminCompetition:perTimeFrame')}
                                </MenuItem>
                            </Select>
                        </FormControl>
                    </Grid>

                    {timeFrameType === 'per_frame' && (
                        <Grid item>
                            <FormControl
                                variant="outlined"
                                size="small"
                                sx={{ minWidth: 150 }}
                            >
                                <InputLabel id="time-frame-unit-select-label">
                                    {t('adminCompetition:timeFrameUnit')}
                                </InputLabel>
                                <Select
                                    labelId="time-frame-unit-select-label"
                                    value={timeFrameUnit}
                                    label={t('adminCompetition:timeFrameUnit')}
                                    onChange={handleChangeTimeFrameUnit}
                                >
                                    <MenuItem value="hourly">
                                        {t('adminCompetition:hourly')}
                                    </MenuItem>
                                    <MenuItem value="daily">
                                        {t('adminCompetition:daily')}
                                    </MenuItem>
                                    <MenuItem value="weekly">
                                        {t('adminCompetition:weekly')}
                                    </MenuItem>
                                </Select>
                            </FormControl>
                        </Grid>
                    )}
                </Grid>
            </Box>

            <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 2 }}>
                <Tabs
                    value={currentTab}
                    onChange={handleChangeTab}
                    aria-label="chart tabs"
                    variant="fullWidth"
                >
                    <Tab label={t('adminCompetition:overview')} />
                    <Tab label={t('adminCompetition:participants')} />
                    <Tab label={t('adminCompetition:revenue')} />
                </Tabs>
            </Box>

            {/* Render the appropriate tab content */}
            {currentTab === 0 && (
                <OverviewTab
                    activeInscriptions={activeInscriptions}
                    chartData={chartData}
                    statusDistribution={statusDistribution}
                    statusColors={statusColors}
                    timeFrameType={timeFrameType}
                    timeFrameUnit={timeFrameUnit}
                    t={t}
                />
            )}

            {currentTab === 1 && (
                <ParticipantsTab
                    chartData={chartData}
                    timeFrameType={timeFrameType}
                    timeFrameUnit={timeFrameUnit}
                    t={t}
                />
            )}

            {currentTab === 2 && (
                <RevenueTab
                    chartData={chartData}
                    timeFrameType={timeFrameType}
                    timeFrameUnit={timeFrameUnit}
                    t={t}
                />
            )}
        </MaxWidth>
    );
};
