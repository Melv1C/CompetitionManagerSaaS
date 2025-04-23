import { Inscription } from '@competition-manager/schemas';

export type TimeFrameType = 'cumulative' | 'per_frame';
export type TimeFrameUnit = 'hourly' | 'daily' | 'weekly';

export type ChartData = {
    key: string;
    date: Date;
    inscriptions: number;
    participants: number;
    revenue: number;
};

export type StatusDistributionData = {
    id: string;
    value: number;
    label: string;
};

export interface TabProps {
    chartData: ChartData[];
    timeFrameType: TimeFrameType;
    timeFrameUnit: TimeFrameUnit;
    t: (key: string) => string;
}

export interface OverviewTabProps {
    activeInscriptions: Inscription[];
    chartData: ChartData[];
    statusDistribution: StatusDistributionData[];
    statusColors: string[];
    t: (key: string) => string;
    timeFrameType: TimeFrameType;
    timeFrameUnit: TimeFrameUnit;
}
