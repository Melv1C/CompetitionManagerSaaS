import { ZodSchema } from 'zod';
import { Response, NextFunction } from 'express';
import { CustomRequest } from './customRequest';

export enum Key {
    Body = 'body',
    Params = 'params',
    Query = 'query',
    Cookies = 'cookies'
}

export const parseRequest = (key: Key, schema: ZodSchema) => (req: CustomRequest, res: Response, next: NextFunction) => {
    const result = schema.safeParse(req[key]);
    console.log(1)
    if (result.success) {
        console.log(2)
        req[key] = result.data;
        next();
    } else {
        console.log(3)
        res.status(400).send(req.t(`zod:${result.error.errors[0].message}`)); // Only send the first error
    }
};



