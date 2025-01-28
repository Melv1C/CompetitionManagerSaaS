
import { DisplayInscription$, Eid } from "@competition-manager/schemas";
import { api } from "../../utils/api";

export const getInscriptions = async (competitionEid: Eid) => {
    const { data } = await api.get(`/competitions/${competitionEid}/inscriptions`);
    return DisplayInscription$.array().parse(data);
}