import { Request } from 'express';
import { TokenData } from '@competition-manager/schemas';

export interface CustomRequest extends Request {
    user?: TokenData;
    t?: (key: string) => string;
}

// Default implementation for `t`
export const defaultT: (key: string) => string = (key) => key;
