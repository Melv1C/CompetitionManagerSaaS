
import { DisplayCompetition, DisplayCompetition$ } from "@competition-manager/schemas";
import { api } from "../../utils/api";

type GetCompetitionsParams = {
    from?: Date;
    to?: Date;
    isAdmin?: boolean;
};

export const getCompetitions = async ({ from, to, isAdmin }: GetCompetitionsParams = {}): Promise<DisplayCompetition[]> => {
    const { data } = await api.get('/competitions', { params: { fromDate: from, toDate: to, isAdmin } });
    return DisplayCompetition$.array().parse(data);
};


