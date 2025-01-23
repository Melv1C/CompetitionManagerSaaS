import { z } from 'zod';

export enum NODE_ENV {
    LOCAL = 'local',
    STAGING = 'staging',
    PROD = 'prod'
}

const env$ = z.object({
    NODE_ENV: z.nativeEnum(NODE_ENV).default(NODE_ENV.STAGING),
});

export const env = env$.parse({
    NODE_ENV: process.env.NODE_ENV || process.env.VITE_NODE_ENV,
});

export function isNodeEnv(nodeEnv: NODE_ENV): boolean {
    return nodeEnv === env.NODE_ENV;
}