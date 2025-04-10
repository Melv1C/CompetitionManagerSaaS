import { api } from '@/utils/api';
import { Result$ } from '@competition-manager/schemas';

/**
 * Fetches all results for a specific competition
 * @param eid Competition entity ID
 * @returns Array of parsed Result objects
 */
export const getResults = async (eid: string) => {
    const { data } = await api.get(`/results/competitions/${eid}`);
    return Result$.array().parse(data);
};
