import { Competition, Competition$, Eid } from "@competition-manager/schemas";
import { api } from "../../utils/api";

export const getCompetition = async (eid: Eid, isAdmin?: boolean): Promise<Competition> => {
    const { data } = await api.get(`/competitions/${eid}`, { params: { isAdmin } });
    return Competition$.parse(data);
}

