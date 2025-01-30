import { CreateInscription, Inscription$ } from "@competition-manager/schemas";
import { api } from "../../utils/api";
import { z } from "zod";

export enum CreateInscriptionsResponseType {
    URL,
    INSCRIPTIONS
}

export const createInscriptions = async (eid: string, inscriptions: CreateInscription[], isAdmin: boolean = false) => {
    const { data } = await api.post(`/competitions/${eid}/inscriptions`, inscriptions, { params: { isAdmin } });
    console.log(data);
    switch (typeof data) {
        case 'string':
            return {
                type: CreateInscriptionsResponseType.URL,
                url: z.string().url().parse(data),
                inscriptions: []
            }
        case 'object':
            return {
                type: CreateInscriptionsResponseType.INSCRIPTIONS,
                url: undefined,
                inscriptions: Inscription$.array().parse(data)
            }
        default:
            throw new Error('Invalid response');
    }
}