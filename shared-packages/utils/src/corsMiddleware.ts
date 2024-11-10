import { Request, Response, NextFunction } from 'express';


export const corsMiddleware = (req: Request, res: Response, next: NextFunction) => {

    const allowOrigin = process.env.ALLOW_ORIGIN;

    console.log('allowOrigin', allowOrigin);

    if (!allowOrigin) {
        next();
        return;
    } 

    res.setHeader('Access-Control-Allow-Origin', allowOrigin);
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

    if (allowOrigin !== '*') {
        res.header('Access-Control-Allow-Credentials', 'true');  
    }

    next();
}
