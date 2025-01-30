
import { Eid, Inscription$ } from "@competition-manager/schemas";
import { api } from "../../utils/api";

export const getAdminInscriptions = async (competitionEid: Eid) => {
    const { data } = await api.get(`/competitions/${competitionEid}/inscriptions`, { params: { isAdmin: true } });
    return Inscription$.array().parse(data);
}