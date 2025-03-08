/**
 * File: apps/competition-manager-web/src/api/Inscription/deleteInscriptions.ts
 *
 * This module provides functionality to delete inscriptions from a competition.
 * It handles the API call to remove an inscription while maintaining proper error handling
 * and type safety.
 */

import { api } from '@/utils/api';
import { Eid } from '@competition-manager/schemas';

/**
 * Deletes a specific inscription from a competition.
 *
 * This function makes a DELETE request to the competition's inscription endpoint.
 * It handles both the API call and basic error handling.
 *
 * @param competitionEid - External ID of the competition
 * @param inscriptionEid - External ID of the inscription to delete
 * @returns Promise<boolean> - Resolves to true if deletion was successful
 *
 * @example
 * ```typescript
 * try {
 *   await deleteInscriptions(competitionEid, inscriptionEid);
 *   // Handle successful deletion
 * } catch (error) {
 *   // Handle error
 * }
 * ```
 */
export const deleteInscriptions = async (
    competitionEid: Eid,
    inscriptionEid: Eid
): Promise<boolean> => {
    await api.delete(
        `/competitions/${competitionEid}/inscriptions/${inscriptionEid}`
    );
    return true;
};
