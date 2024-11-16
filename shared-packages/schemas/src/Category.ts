import z from 'zod';


export const Category$ = z.object({
    id: z.number().positive(),
    abbr: z.string(),
    name: z.string(),
});

export type Category = z.infer<typeof Category$>;




