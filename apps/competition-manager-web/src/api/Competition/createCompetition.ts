import { CreateCompetition, Competition$ } from "@competition-manager/schemas";
import { api } from "../../utils/api";

export const createCompetition = async (competition: CreateCompetition) => {
    const { data } = await api.post('/competitions', competition);
    return Competition$.parse(data);
}