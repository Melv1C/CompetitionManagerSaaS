import { Router } from 'express';
import { z } from 'zod';
import { prisma } from '@competition-manager/prisma';
import { parseRequest, generateAccessToken, generateRefreshToken, Key, comparePassword, isNodeEnv, catchError } from '@competition-manager/backend-utils';
import { NODE_ENV, User$ } from '@competition-manager/schemas';
import { UserToTokenData } from '../utils';
import { logger } from '../logger';
import { env } from '../env';

export const router = Router();

const Body$ = z.object({
    email: z.string({ message: 'Email must be a string' }).email({ message: 'Email must be a valid email' }),
    password: z.string({ message: 'Password must be a string' })
});

router.post(
    '/login',
    parseRequest(Key.Body, Body$),
    async (req, res) => {
        try {
            const { email, password } = Body$.parse(req.body);
            const user = await prisma.user.findUnique({
                where: {
                    email: email
                },
                include: {
                    preferences: true
                }
            });
            if (!user) {
                res.status(400).send("userNotFound");
                return;
            }
            const valid = await comparePassword(password, user.password);
            if (!valid) {
                res.status(400).send("invalidPassword");
                return;
            }
            const tokenData = UserToTokenData(User$.parse(user));
            const accessToken = generateAccessToken(tokenData);
            const refreshToken = generateRefreshToken(tokenData);
            res.cookie(`refreshToken_${env.NODE_ENV}`, refreshToken, {
                httpOnly: true,
                secure: isNodeEnv(NODE_ENV.PROD),
                sameSite: 'strict',
                maxAge: 30 * 24 * 60 * 60 * 1000,   // 30 days
            }).send(accessToken);
        } catch (error) {
            catchError(logger)(error, {
                message: 'Internal server error',
                path: 'POST /login',
                status: 500
            });
            res.status(500).send('internalServerError');
        }
    }
);
