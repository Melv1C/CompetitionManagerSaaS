import { api } from '@/utils/api';
import { CreateResult, Result$ } from '@competition-manager/schemas';
import { useMutation, useQueryClient } from 'react-query';

// Define the API function separately for both direct calls and React Query
export const upsertResults = async (results: CreateResult[]) => {
    console.log('upsertResults', results);
    const { data } = await api.post(`/results`, results);
    return Result$.array().parse(data);
};

// React Query hook for upserting results
export const useUpsertResults = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: upsertResults,
        onSuccess: (data, variables) => {
            // Extract the competitionEventId from the first result
            if (variables.length > 0) {
                const eventId = variables[0].competitionEventId;
                // Invalidate queries related to this event's results
                queryClient.invalidateQueries(['results', eventId]);
            }
            
            // Invalidate all results queries as a fallback
            queryClient.invalidateQueries(['results']);
        }
    });
};
