import { Box, } from "@mui/material";
import { EncodeProps } from "./type";
import { DistanceEncode } from "./DistanceEncode";
import { useAtomValue } from "jotai";
import { useMemo } from "react";
import { adminInscriptionsAtom, competitionAtom, resultsAtom } from "@/GlobalsStates";
import { useUpsertResults } from "@/api/Result/upsertResults";
import { CreateResult, CreateResult$, Inscription } from "@competition-manager/schemas";
import { ParticipantsSelector } from "./ParticipantsSelector";


export const Encode: React.FC<EncodeProps> = ({ event }) => {
    const results = useAtomValue(resultsAtom);
    if (!results) throw new Error('No results found');

    const adminInscriptions = useAtomValue(adminInscriptionsAtom);
    if (!adminInscriptions) throw new Error('No inscriptions found');

    const competition = useAtomValue(competitionAtom);
    if (!competition) throw new Error('No competition found');
    
    // Filter inscriptions for this event
    const inscriptions = useMemo(() => 
        adminInscriptions.filter(inscription => inscription.competitionEvent.id === event.id), 
        [adminInscriptions, event.id]
    );
    
    const eventResults = useMemo(() =>
        results.filter(result => result.competitionEvent.id === event.id), 
        [results, event.id]
    );
    
    // Use the React Query mutation hook for updating results
    const upsertResultsMutation = useUpsertResults();
    
    const handleParticipantSubmit = (selectedInscriptions: Inscription[]) => {
        const createResults: CreateResult[] = selectedInscriptions.map((inscription, index: number) => {
            return CreateResult$.parse({
                competitionEid: competition.eid,
                competitionEventEid: event.eid,
                inscriptionId: inscription.id,
                bib: inscription.bib,
                athleteLicense: inscription.athlete.license,
                initialOrder: index + 1,
                tempOrder: index + 1,
            });
        });
        
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
            <DistanceEncode event={event} />
        </Box>
    );
};

