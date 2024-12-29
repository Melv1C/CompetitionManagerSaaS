import { z } from 'zod';

export const Email$ = z.object({
    to: z.string().email(),
    subject: z.string(),
    html: z.string(),
})
export type Email = z.infer<typeof Email$>;