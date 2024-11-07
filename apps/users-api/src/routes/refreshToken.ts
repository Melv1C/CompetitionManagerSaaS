import { Router } from 'express';
import { z } from 'zod';
import jwt from 'jsonwebtoken';
import { parseRequest, generateAccessToken, generateRefreshToken, verifyRefreshToken } from '@competition-manager/utils';
import { TokenData$ } from '@competition-manager/schemas';

export const router = Router();

const Cookies$ = z.object({
    refreshToken: z.string()
});

router.get(
    '/refresh-token',
    parseRequest('cookies', Cookies$),
    async (req, res) => {
        const { refreshToken } = Cookies$.parse(req.cookies);
        const validRefreshToken = verifyRefreshToken(refreshToken);
        console.log(jwt.decode(refreshToken));
        const tokenData = TokenData$.parse(jwt.decode(refreshToken));
        if (!validRefreshToken) {
            res.status(401).json({ message: 'Invalid refresh token' });
            return;
        }
        const accessToken = generateAccessToken(tokenData);
        const newRefreshToken = generateRefreshToken(tokenData);
        res.cookie('refreshToken', newRefreshToken, {
            httpOnly: true,
            secure: true,
            sameSite: 'strict', 
            maxAge: 30 * 24 * 60 * 60 * 1000,   // 30 days
        }).send(accessToken);
    }
);