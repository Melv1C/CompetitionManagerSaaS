import { z } from 'zod';

export const Id$ = z.union([
    z.number(),
    z.string().transform((str) => {
        const parsed = parseInt(str, 10);
        if (isNaN(parsed)) {
            throw new Error("Invalid number string");
        }
        return parsed;
    }),
]);
export type Id = z.infer<typeof Id$>;