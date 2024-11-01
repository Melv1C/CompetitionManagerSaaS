import { ZodSchema } from 'zod';
import { Request, Response, NextFunction } from 'express';

type Key = 'body' | 'params' | 'query';

export const parseRequest = (key: Key, schema: ZodSchema) => (req: Request, res: Response, next: NextFunction) => {
    const result = schema.safeParse(req[key]);
    if (result.success) {
        req[key] = result.data;
        next();
    } else {
        res.status(400).send(result.error.errors); // only send the first error message
    }
};



