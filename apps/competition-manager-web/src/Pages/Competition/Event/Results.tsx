import { resultsAtom } from '@/GlobalsStates';
import { EventType, Result } from '@competition-manager/schemas';
import { sortPerf } from '@competition-manager/utils';
import { Box, Typography } from '@mui/material';
import { useAtomValue } from 'jotai';
import { useTranslation } from 'react-i18next';
import {
    DistanceResults,
    GenericResults,
    HeightResults,
    PointsResults,
    TimeResults,
} from './ResultTypeDisplays';

interface ResultsProps {
    eventId: string;
    eventType: EventType;
}

export const Results = ({ eventId, eventType }: ResultsProps) => {
    const { t } = useTranslation();
    const allResults = useAtomValue(resultsAtom);

    if (!allResults || allResults.length === 0) {
        return (
            <Typography variant="body1" color="text.secondary">
                {t('competition:results.noResultsAvailable')}
            </Typography>
        );
    }

    // Filter results for this event
    const results = allResults
        .filter((r) => r.competitionEvent.eid === eventId)
        .sort((a, b) => {
            // Sort by finalOrder if available, then by value
            if (a.finalOrder && b.finalOrder) {
                return a.finalOrder - b.finalOrder;
            }
            return sortPerf(
                a.value ?? -1,
                b.value ?? -1,
                a.competitionEvent.event.type
            );
        });

    if (results.length === 0) {
        return (
            <Typography variant="body1" color="text.secondary">
                {t('competition:results.noResultsForEvent')}
            </Typography>
        );
    }

    return (
        <Box sx={{ mt: 2 }}>
            <Typography variant="h6" gutterBottom>
                {t('glossary:results')}
            </Typography>

            {renderResultsByType(results, eventType)}
        </Box>
    );
};

const renderResultsByType = (results: Result[], eventType: EventType) => {
    switch (eventType) {
        case EventType.TIME:
            return <TimeResults results={results} />;
        case EventType.DISTANCE:
            return <DistanceResults results={results} />;
        case EventType.HEIGHT:
            return <HeightResults results={results} />;
        case EventType.POINTS:
            return <PointsResults results={results} />;
        default:
            return <GenericResults results={results} />;
    }
};
