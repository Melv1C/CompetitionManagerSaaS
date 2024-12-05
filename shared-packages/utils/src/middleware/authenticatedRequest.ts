import { Request } from 'express';
import { User$ } from '@competition-manager/schemas';
import { z } from 'zod';

const UserFromToken$ = User$.omit({
    password: true,
});

export type UserFromToken = z.infer<typeof UserFromToken$>;


export interface AuthenticatedRequest extends Request {
    user?: UserFromToken;
}
