import z from 'zod';


export const Category$ = z.object({
    id: z.number().positive(),
    abbr: z.string(),
    name: z.string(),
    birthYears: z.array(z.number()).optional(), //a discuter  //array(number or date)
});

export type Category = z.infer<typeof Category$>;




