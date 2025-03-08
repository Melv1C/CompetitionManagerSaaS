import { CreateInscription, Inscription$ } from '@competition-manager/schemas';
import { z } from 'zod';
import { api } from '@/utils/api';

export enum CreateInscriptionsResponseType {
    URL,
    INSCRIPTIONS,
}

export const createInscriptions = async (
    eid: string,
    inscriptions: CreateInscription[],
    isAdmin: boolean = false
) => {
    const { data } = await api.post(
        `/competitions/${eid}/inscriptions`,
        inscriptions,
        { params: { isAdmin } }
    );
    switch (typeof data) {
        case 'string':
            return {
                type: CreateInscriptionsResponseType.URL,
                url: z.string().url().parse(data),
                inscriptions: [],
            };
        case 'object':
            return {
                type: CreateInscriptionsResponseType.INSCRIPTIONS,
                url: undefined,
                inscriptions: Inscription$.array().parse(data),
            };
        default:
            throw new Error('Invalid response');
    }
};
