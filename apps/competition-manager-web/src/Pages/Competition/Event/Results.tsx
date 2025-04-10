import { resultsAtom } from '@/GlobalsStates';
import { EventType, Result } from '@competition-manager/schemas';
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
import { isBestResult } from '@competition-manager/utils';

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
                {t('No results available')}
            </Typography>
        );
    }

    // Filter results for this event
    const results = allResults
        .filter((r) => r.competitionEvent.eid === eventId)
        .sort((a, b) => {
            // Sort by finalOrder if available, then by value
            if (a.finalOrder !== null && b.finalOrder !== null) {
                return (a.finalOrder ?? 0) - (b.finalOrder ?? 0);
            }
            // Provide default values (0) if the result values are null or undefined
            return isBestResult(a.value ?? 0, b.value ?? 0, eventType) ? -1 : 1;
        });

    if (results.length === 0) {
        return (
            <Typography variant="body1" color="text.secondary">
                {t('No results available for this event')}
            </Typography>
        );
    }

    return (
        <Box sx={{ mt: 2 }}>
            <Typography variant="h6" gutterBottom>
                {t('Results')}
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
