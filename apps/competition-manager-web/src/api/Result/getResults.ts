import { api } from '@/utils/api';
import { Result$ } from '@competition-manager/schemas';

/**
 * Fetches all results for a specific competition
 * @param eid Competition entity ID
 * @returns Array of parsed Result objects
 */
export const getResults = async (competitionEid: string) => {
    const { data } = await api.get(`/results/competitions/${competitionEid}`);
    return Result$.array().parse(data);
};
