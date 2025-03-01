import { Eid, Inscription$, NODE_ENV } from '@competition-manager/schemas';
import { isNodeEnv } from '../../env';
import { api } from '../../utils/api';

export const getUsersInscriptions = async (competitionEid?: Eid) => {
    try {
        if (isNodeEnv(NODE_ENV.LOCAL)) {
            return [];
        }
        const { data } = await api.get('/users/me/inscriptions', {
            params: {
                competitionEid,
            },
        });
        return Inscription$.array().parse(data);
    } catch (error) {
        console.error(error);
        return [];
    }
};
