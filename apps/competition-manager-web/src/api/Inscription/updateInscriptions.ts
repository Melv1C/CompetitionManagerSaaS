import { api } from '@/utils/api';
import {
    Inscription,
    Inscription$,
    UpdateInscription$,
} from '@competition-manager/schemas';

export const updateInscriptions = async (
    eid: string,
    inscriptions: Inscription[]
) => {
    const updatedInscriptions = await Promise.all(
        inscriptions.map(async (inscription) => {
            const { data } = await api.put(
                `/competitions/${eid}/inscriptions/${inscription.eid}`,
                UpdateInscription$.parse(inscription)
            );
            return data;
        })
    );
    return Inscription$.array().parse(updatedInscriptions);
};
