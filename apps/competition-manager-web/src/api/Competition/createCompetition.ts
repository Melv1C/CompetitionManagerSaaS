import { api } from '@/utils/api';
import { Competition$, CreateCompetition } from '@competition-manager/schemas';

export const createCompetition = async (competition: CreateCompetition) => {
    const { data } = await api.post('/competitions', competition);
    return Competition$.parse(data);
};
