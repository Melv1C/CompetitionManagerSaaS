import z from 'zod';

export const LocalResult$ = z.object({
    id: z.number(),
    licensenumber: z.string(),
    value: z.string(),
    wind: z.number().nullish(),
    seqno: z.number(),
});
export type LocalResult = z.infer<typeof LocalResult$>;
