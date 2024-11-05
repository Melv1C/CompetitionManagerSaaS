import { Router } from 'express';
import { z } from 'zod';
import { generateAccessToken, generateRefreshToken, verifyRefreshToken } from './utils';
import jwt from 'jsonwebtoken';
import { parseRequest } from '@competition-manager/utils';
import { NextFunction, Request, Response } from 'express';//a dégager

export const router = Router();

const Cookies$ = z.object({
    refreshToken: z.string()
});

const aaaaa = () => (req: Request, res: Response, next: NextFunction) => {
    console.log(req.cookies);
    next();
};

router.get(
    '/refresh-token',
    aaaaa(),
    parseRequest('cookies', Cookies$),
    async (req, res) => {
        const { refreshToken } = Cookies$.parse(req.cookies);
        const validRefreshToken = verifyRefreshToken(refreshToken);
        const { email } = jwt.decode(refreshToken) as { email: string };
        console.log(email);
        if (!validRefreshToken) {
            res.status(401).json({ message: 'Invalid refresh token' });
            return;
        }
        const accessToken = generateAccessToken(email);
        const newRefreshToken = generateRefreshToken(email);
        res.cookie('refreshToken', newRefreshToken, {
            httpOnly: true,
            secure: true,
            sameSite: 'strict', 
            maxAge: 30 * 24 * 60 * 60 * 1000,   // 30 days
        }).send(accessToken);
    }
);