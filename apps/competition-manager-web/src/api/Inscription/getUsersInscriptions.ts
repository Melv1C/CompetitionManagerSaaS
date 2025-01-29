import { Eid, Inscription$ } from "@competition-manager/schemas";
import { api } from "../../utils/api";

export const getUsersInscriptions = async (competitionEid?: Eid) => {
    const { data } = await api.get('/users/me/inscriptions', {
        params: {
            competitionEid
        }
    });
    return Inscription$.array().parse(data);
}