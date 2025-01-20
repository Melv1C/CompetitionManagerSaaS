import { Athlete$, AthleteKey } from "@competition-manager/schemas";
import { api } from "../utils/api";

export const getAthletes = async (key: AthleteKey) => {
    const { data } = await api.get('/athletes', { params: { key } });
    return Athlete$.array().parse(data);
}