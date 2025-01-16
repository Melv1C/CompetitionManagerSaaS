import { Router } from 'express';
import { z } from 'zod';
import { parseRequest, generateAccessToken, generateRefreshToken, verifyRefreshToken, Key } from '@competition-manager/backend-utils';

export const router = Router();

const Cookies$ = z.object({
    refreshToken: z.string()
});

router.get(
    '/refresh-token',
    parseRequest(Key.Cookies, Cookies$),
    async (req, res) => {
        const { refreshToken } = Cookies$.parse(req.cookies);
        const tokenData = verifyRefreshToken(refreshToken);
        if (!tokenData) {
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