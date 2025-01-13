
export enum NODE_ENV {
    LOCAL = 'local',
    STAGING = 'staging',
    PROD = 'prod'
}

export function isNodeEnv(env: NODE_ENV): boolean {
    return process.env.NODE_ENV === env;
}