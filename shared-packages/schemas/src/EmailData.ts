import { z } from 'zod';

export const EmailData$ = z.object({
    to: z.string().email(),
    subject: z.string(),
    html: z.string(),
})
export type EmailData = z.infer<typeof EmailData$>;