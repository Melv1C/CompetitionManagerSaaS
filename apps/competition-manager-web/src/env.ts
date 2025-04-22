import { NODE_ENV } from '@competition-manager/schemas';
import { z } from 'zod';

const env$ = z.object({
    VITE_NODE_ENV: z.nativeEnum(NODE_ENV).default(NODE_ENV.STAGING),
    VITE_API_BASE_URL: z.string().default('https://competitionmanager.be/api'),
    VITE_SOCKET_URL: z.string().default('http://competitionmanager.be:8080'),
    VITE_LOCAL_ACCESS_TOKEN: z.string().optional(),
});


export function isNodeEnv(nodeEnv: NODE_ENV): boolean {
    return nodeEnv === env.VITE_NODE_ENV;
}

export const env = env$.parse(import.meta.env);

