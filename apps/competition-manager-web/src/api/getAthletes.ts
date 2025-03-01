import { Athlete$, AthleteKey } from '@competition-manager/schemas';
import axios from 'axios';
import { api } from '../utils/api';

export const getAthletes = async (key: AthleteKey) => {
    try {
        const { data } = await api.get('/athletes', { params: { key } });
        return Athlete$.array().parse(data);
    } catch (error) {
        if (axios.isAxiosError(error) && error.response?.status === 404) {
            return [];
        } else {
            throw error;
        }
    }
};
