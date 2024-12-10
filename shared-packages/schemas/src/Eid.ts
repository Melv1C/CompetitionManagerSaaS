import { z } from 'zod';


export const Eid$ = z.string();

export type Eid = z.infer<typeof Eid$>;