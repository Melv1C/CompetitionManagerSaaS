import { z } from 'zod';
import { User$ } from './User';

export const TokenData$ = User$.omit({ password: true });

export type TokenData = z.infer<typeof TokenData$>;