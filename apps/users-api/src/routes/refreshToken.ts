import { Router } from 'express';
import { z } from 'zod';
import { parseRequest, generateAccessToken, generateRefreshToken, verifyRefreshToken, Key, catchError } from '@competition-manager/backend-utils';
import { logger } from '../logger';
import { prisma } from '@competition-manager/prisma';
import { UserToTokenData } from '../utils';
import { User$ } from '@competition-manager/schemas';

export const router = Router();

const Cookies$ = z.object({
    refreshToken: z.string()
});

router.get(
    '/refresh-token',
    parseRequest(Key.Cookies, Cookies$),
    async (req, res) => {
        try {
            const { refreshToken } = Cookies$.parse(req.cookies);
            const tokenData = verifyRefreshToken(refreshToken);
            if (!tokenData) {
                res.status(401).send("invalidRefreshToken");
                return;
            }

            const user = await prisma.user.findUnique({
                where: {
                    id: tokenData.id
                },
                include: {
                    preferences: true
                }
            });

            if (!user) {
                res.status(400).send("userNotFound");
                return;
            }

            const newTokenData = UserToTokenData(User$.parse(user));

            const accessToken = generateAccessToken(newTokenData);
            const newRefreshToken = generateRefreshToken(newTokenData);
            res.cookie('refreshToken', newRefreshToken, {
                httpOnly: true,
                secure: true,
                sameSite: 'strict', 
                maxAge: 30 * 24 * 60 * 60 * 1000,   // 30 days
            }).send(accessToken);
        } catch (error) {
            catchError(logger)(error, {
                message: 'Internal server error',
                path: 'GET /refresh-token',
                status: 500
            });
            res.status(500).send('internalServerError');
        }
    }
);