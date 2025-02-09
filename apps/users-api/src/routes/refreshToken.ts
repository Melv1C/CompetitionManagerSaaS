import { Router } from 'express';
import { z } from 'zod';
import { parseRequest, generateAccessToken, generateRefreshToken, verifyRefreshToken, Key, catchError, isNodeEnv } from '@competition-manager/backend-utils';
import { logger } from '../logger';
import { prisma } from '@competition-manager/prisma';
import { UserToTokenData } from '../utils';
import { NODE_ENV, User$ } from '@competition-manager/schemas';
import { env } from '../env';

export const router = Router();

const Cookies$ = z.object({
    [`refreshToken_${env.NODE_ENV}`]: z.string()
});

router.get(
    '/refresh-token',
    parseRequest(Key.Cookies, Cookies$),
    async (req, res) => {
        try {
            const refreshToken = Cookies$.parse(req.cookies)[`refreshToken_${env.NODE_ENV}`];
            const tokenData = verifyRefreshToken(refreshToken);
            if (!tokenData) {
                res.status(401).send(req.t('errors.invalidRefreshToken'));
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
                res.status(400).send(req.t('errors.userNotFound'));
                return;
            }

            // check if the token and the user are the same
            if (user.email !== tokenData.email) {
                res.status(401).send(req.t('errors.invalidRefreshToken'));
                return;
            }

            const newTokenData = UserToTokenData(User$.parse(user));

            const accessToken = generateAccessToken(newTokenData);
            const newRefreshToken = generateRefreshToken(newTokenData);
            res.cookie(`refreshToken_${env.NODE_ENV}`, newRefreshToken, {
                httpOnly: true,
                secure: isNodeEnv(NODE_ENV.PROD),
                sameSite: 'strict', 
                maxAge: 30 * 24 * 60 * 60 * 1000,   // 30 days
            }).send(accessToken);
        } catch (error) {
            catchError(logger)(error, {
                message: 'Internal server error',
                path: 'GET /refresh-token',
                status: 500
            });
            res.status(500).send(req.t('errors.internalServerError'));
        }
    }
);