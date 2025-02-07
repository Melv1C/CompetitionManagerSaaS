import { Request } from 'express';
import { TokenData } from '@competition-manager/schemas';

export interface AuthentificatedRequest extends Request {
    user?: TokenData;
}
