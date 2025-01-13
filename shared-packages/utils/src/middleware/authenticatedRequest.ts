import { Request } from 'express';
import { TokenData } from '@competition-manager/schemas';

export interface AuthenticatedRequest extends Request {
    user?: TokenData;
}
