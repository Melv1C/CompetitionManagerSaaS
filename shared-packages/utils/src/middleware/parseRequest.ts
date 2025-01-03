import { ZodSchema } from 'zod';
import { Request, Response, NextFunction } from 'express';

export enum Key {
    Body = 'body',
    Params = 'params',
    Query = 'query',
    Cookies = 'cookies'
}

export const parseRequest = (key: Key, schema: ZodSchema) => (req: Request, res: Response, next: NextFunction) => {
    const result = schema.safeParse(req[key]);
    if (result.success) {
        req[key] = result.data;
        next();
    } else {
        res.status(400).send(result.error.errors); // only send the first error message
    }
};



