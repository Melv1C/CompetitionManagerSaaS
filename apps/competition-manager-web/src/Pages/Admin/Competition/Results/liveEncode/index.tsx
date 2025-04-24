import { upsertResults } from '@/api';
import {
    adminInscriptionsAtom,
    competitionAtom,
    resultsAtom,
} from '@/GlobalsStates';
import {
    CreateResult,
    CreateResult$,
    Inscription,
} from '@competition-manager/schemas';
import { Box } from '@mui/material';
import { useAtomValue } from 'jotai';
import { useMemo } from 'react';
import { useMutation, useQueryClient } from 'react-query';
import { DistanceEncode } from './DistanceEncode';
import { ParticipantsSelector } from './ParticipantsSelector';
import { EncodeProps } from './type';
import { HeightEncode } from './HeightEncode';

export const Encode: React.FC<EncodeProps> = ({ event }) => {
    const results = useAtomValue(resultsAtom);
    if (!results) throw new Error('No results found');

    const adminInscriptions = useAtomValue(adminInscriptionsAtom);
    if (!adminInscriptions) throw new Error('No inscriptions found');

    const competition = useAtomValue(competitionAtom);
    if (!competition) throw new Error('No competition found');

    // Filter inscriptions for this event
    const inscriptions = useMemo(
        () =>
            adminInscriptions.filter(
                (inscription) => inscription.competitionEvent.id === event.id
            ),
        [adminInscriptions, event.id]
    );

    const eventResults = useMemo(
        () =>
            results.filter((result) => result.competitionEvent.id === event.id),
        [results, event.id]
    );

    // Use the React Query mutation hook for updating results
    const queryClient = useQueryClient();
    const upsertResultsMutation = useMutation({
        mutationFn: upsertResults,
        onSuccess: () => {
            // Invalidate all results for the competition
            queryClient.invalidateQueries(['results', competition.eid]);
        },
        onError: (error) => {
            console.error('Error upserting results:', error);
        },
    });

    const handleParticipantSubmit = (selectedInscriptions: Inscription[]) => {
        const createResults: CreateResult[] = selectedInscriptions.map(
            (inscription, index: number) => {
                return CreateResult$.parse({
                    competitionEid: competition.eid,
                    competitionEventEid: event.eid,
                    inscriptionId: inscription.id,
                    bib: inscription.bib,
                    athleteLicense: inscription.athlete.license,
                    initialOrder: index + 1,
                    tempOrder: index + 1,
                });
            }
        );

        upsertResultsMutation.mutate(createResults);
    };

    // If no results exist yet, show participant selector
    if (!eventResults || eventResults.length === 0) {
        return (
            <ParticipantsSelector
                inscriptions={inscriptions}
                onSubmit={handleParticipantSubmit}
                isSubmitting={upsertResultsMutation.isLoading}
            />
        );
    }

    // Show the appropriate encode component based on event type
    return (
        <Box sx={{ display: 'flex', flexDirection: 'column' }}>
            {event.event.type === 'height' ? (
                <HeightEncode event={event} />
            ) : (
                <DistanceEncode event={event} />
            )}
        </Box>
    );
};
