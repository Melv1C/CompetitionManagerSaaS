import z from 'zod';



export const Club$ = z.object({
    id: z.number().positive(),
    name: z.string(),
    abbr: z.string(),
    address: z.string().optional(),

});

export type Club = z.infer<typeof Club$>;
