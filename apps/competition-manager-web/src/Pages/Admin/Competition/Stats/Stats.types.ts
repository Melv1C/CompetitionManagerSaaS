export type TimeFrame =
    | 'hourly'
    | 'daily'
    | 'weekly'
    | 'monthly'
    | 'cumulative';

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
