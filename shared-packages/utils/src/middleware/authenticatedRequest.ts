import { Request } from 'express';
import { TokenData, User$ } from '@competition-manager/schemas';
import { z } from 'zod';

export interface AuthenticatedRequest extends Request {
    user?: TokenData;
}
