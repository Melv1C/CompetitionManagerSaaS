import {
    Id,
    Inscription,
    InscriptionStatus,
} from '@competition-manager/schemas';
import {
    ChartData,
    StatusDistributionData,
    TimeFrameType,
    TimeFrameUnit,
} from '../types';

export const prepareChartData = (
    inscriptions: Inscription[],
    timeFrameType: TimeFrameType,
    timeFrameUnit: TimeFrameUnit
): ChartData[] => {
    if (inscriptions.length === 0) return [];

    // Sort inscriptions by date
    const sortedInscriptions = [...inscriptions].sort(
        (a, b) => a.date.getTime() - b.date.getTime()
    );

    const dataMap = new Map<
        string,
        {
            date: Date;
            count: number;
            uniqueAthletes: Set<Id>;
            revenue: number;
        }
    >();

    // Track all athletes seen across all time frames
    const allSeenAthletes = new Set<Id>();

    // Find min and max dates for generating all frames
    const minDate = new Date(sortedInscriptions[0].date);
    const maxDate = new Date(
        sortedInscriptions[sortedInscriptions.length - 1].date
    );

    // If per_frame, generate all possible frames between min and max dates
    if (timeFrameType === 'per_frame') {
        let current = new Date(minDate);

        switch (timeFrameUnit) {
            case 'hourly': {
                while (current <= maxDate) {
                    const key = `${current.toLocaleDateString()}-${current.getHours()}`;
                    dataMap.set(key, {
                        date: new Date(current),
                        count: 0,
                        uniqueAthletes: new Set<Id>(),
                        revenue: 0,
                    });
                    current = new Date(current.getTime() + 60 * 60 * 1000); // Add 1 hour
                }
                break;
            }
            case 'daily': {
                while (current <= maxDate) {
                    const key = current.toLocaleDateString();
                    dataMap.set(key, {
                        date: new Date(current),
                        count: 0,
                        uniqueAthletes: new Set<Id>(),
                        revenue: 0,
                    });
                    current.setDate(current.getDate() + 1); // Add 1 day
                }
                break;
            }
            case 'weekly': {
                // Adjust to first day of week
                const firstDayOfFirstWeek = new Date(current);
                const day = firstDayOfFirstWeek.getDay();
                const diff =
                    firstDayOfFirstWeek.getDate() - day + (day === 0 ? -6 : 1);
                firstDayOfFirstWeek.setDate(diff);

                current = new Date(firstDayOfFirstWeek);

                while (current <= maxDate) {
                    const key = current.toLocaleDateString();
                    dataMap.set(key, {
                        date: new Date(current),
                        count: 0,
                        uniqueAthletes: new Set<Id>(),
                        revenue: 0,
                    });
                    current.setDate(current.getDate() + 7); // Add 1 week
                }
                break;
            }
        }
    }

    // Group data by selected time frame
    sortedInscriptions.forEach((inscription) => {
        const date = new Date(inscription.date);
        let key: string;

        // If it's cumulative, we want exact dates for each entry
        if (timeFrameType === 'cumulative') {
            key = `${date.toISOString()}`; // YYYY-MM-DD format
        } else {
            // For per_frame, use the selected unit
            switch (timeFrameUnit) {
                case 'hourly':
                    key = `${date.toLocaleDateString()}-${date.getHours()}`;
                    break;
                case 'weekly': {
                    const firstDayOfWeek = new Date(date);
                    const day = date.getDay();
                    const diff = date.getDate() - day + (day === 0 ? -6 : 1);
                    firstDayOfWeek.setDate(diff);
                    key = firstDayOfWeek.toLocaleDateString();
                    break;
                }
                case 'daily':
                default:
                    key = date.toLocaleDateString();
                    break;
            }
        }

        if (!dataMap.has(key)) {
            dataMap.set(key, {
                date,
                count: 0,
                uniqueAthletes: new Set<Id>(),
                revenue: 0,
            });
        }

        const entry = dataMap.get(key)!;
        entry.count += 1;

        // Only add the athlete to the current frame's uniqueAthletes if we haven't seen them before
        if (!allSeenAthletes.has(inscription.athlete.id)) {
            entry.uniqueAthletes.add(inscription.athlete.id);
            allSeenAthletes.add(inscription.athlete.id);
        }

        entry.revenue += inscription.paid || 0;
    });

    // Convert map to array
    let result = Array.from(dataMap.entries()).map(([key, value]) => ({
        key,
        date: value.date,
        inscriptions: value.count,
        participants: value.uniqueAthletes.size,
        revenue: value.revenue,
    }));

    // Sort by date for consistent results
    result.sort((a, b) => a.date.getTime() - b.date.getTime());

    console.log('Chart data:', result);

    // For cumulative view, calculate running sums
    if (timeFrameType === 'cumulative') {
        let inscriptionsSum = 0;
        let revenueSum = 0;
        let participantsSum = 0;

        result = result.map((day) => {
            inscriptionsSum += day.inscriptions;
            participantsSum += day.participants;
            revenueSum += day.revenue;

            return {
                ...day,
                inscriptions: inscriptionsSum,
                participants: participantsSum,
                revenue: revenueSum,
            };
        });
    }

    return result;
};

export const getStatusDistribution = (
    inscriptions: Inscription[],
    t: (key: string) => string
): StatusDistributionData[] => {
    const statusCounts: Record<string, number> = {};

    inscriptions.forEach((inscription) => {
        statusCounts[inscription.status] =
            (statusCounts[inscription.status] || 0) + 1;
    });

    return Object.entries(statusCounts).map(([status, value]) => ({
        id: status,
        value,
        label: t(`glossary:${status}`),
    }));
};

export const getStatusColor = (status: string): string => {
    switch (status) {
        case InscriptionStatus.ACCEPTED:
            return '#2196f3';
        case InscriptionStatus.CONFIRMED:
            return '#4caf50';
        case InscriptionStatus.REGISTERED:
            return '#ff9800';
        case InscriptionStatus.PENDING:
            return '#9c27b0';
        case InscriptionStatus.REFUSED:
            return '#f44336';
        case InscriptionStatus.REMOVED:
            return '#607d8b';
        default:
            return '#999999';
    }
};
