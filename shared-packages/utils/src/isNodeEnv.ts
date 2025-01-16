
export enum NODE_ENV {
    LOCAL = 'local',
    STAGING = 'staging',
    PROD = 'prod'
}

export function isNodeEnv(value: NODE_ENV, env: NODE_ENV): boolean {
    return value === env;
}