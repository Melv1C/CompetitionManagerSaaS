import { Date, LEVEL, Log, Log$, SERVICE } from '@competition-manager/schemas';
import { api } from '../utils';

type GetLogsParams = {
    from?: Date;
    to?: Date;
    limit?: number;
};

export const getLogs = async (
    levels: LEVEL[],
    services: SERVICE[],
    params: GetLogsParams
): Promise<Log[]> => {
    const { data } = await api.get('/logs', {
        params: {
            levels: JSON.stringify(levels),
            services: JSON.stringify(services),
            ...params,
        },
    });
    return Log$.array().parse(data);
};
