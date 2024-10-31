import { ZodSchema, ZodError } from "zod";
import { Request, Response, NextFunction } from "express";

type Key = 'body' | 'params' | 'query';

export const parseRequest = (key: Key, schema: ZodSchema) => (req: Request, res: Response, next: NextFunction) => {
    try {
        req[key] = schema.parse(req[key]);
        next();
    } catch (error) {
        if (error instanceof ZodError) {
            console.log(error);
            res.status(400).send(error.errors);
        } else {
            console.error(error);
            res.status(500).send('Internal Server Error');
        }
    }
}


