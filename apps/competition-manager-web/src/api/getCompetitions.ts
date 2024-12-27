
import { DisplayCompetition, DisplayCompetition$ } from "@competition-manager/schemas";
import { api } from "../utils/api";


type GetCompetitionsParams = {
    from?: Date;
    to?: Date;
    isAdmin?: boolean;
};


export const getCompetitions = async ({ from, to, isAdmin }: GetCompetitionsParams = {}): Promise<DisplayCompetition[]> => {
    try {
        const { data } = await api.get('/competitions', { params: { from, to, isAdmin } });
        return DisplayCompetition$.array().parse(data);
    } catch (error) {
        // TODO: Handle error (React error boundary)
        console.error('Error fetching competitions:', error);
        return [];
    }
};


