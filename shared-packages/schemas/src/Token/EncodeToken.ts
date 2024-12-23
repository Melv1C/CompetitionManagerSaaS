import { z } from 'zod';

export const EncodeToken$ = z.string();

export type EncodeToken = z.infer<typeof EncodeToken$>;

