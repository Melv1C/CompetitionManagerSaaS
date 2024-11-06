import { Router } from 'express';
import { z } from 'zod';
import jwt from 'jsonwebtoken';
import { parseRequest, generateAccessToken, generateRefreshToken, verifyRefreshToken } from '@competition-manager/utils';

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
        const { email } = jwt.decode(refreshToken) as { email: string };
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