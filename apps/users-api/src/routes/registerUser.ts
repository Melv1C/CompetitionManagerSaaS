import { Router } from 'express';
import { prisma } from '@competition-manager/prisma';
import { parseRequest, generateAccessToken, generateRefreshToken, generateVerificationToken, Key, hashPassword, isNodeEnv, catchError, env } from '@competition-manager/backend-utils';
import { User$, CreateUser$, USER_PREFERENCES_DEFAULTS, Role, NODE_ENV, LEVEL } from '@competition-manager/schemas';
import { UserToTokenData, sendVerificationEmail } from '../utils';
import { logger } from '../logger';

export const router = Router();

router.post(
    '/register',
    parseRequest(Key.Body, CreateUser$),
    async (req, res) => {
        try {
            const newUser = CreateUser$.parse(req.body);
            const user = await prisma.user.findUnique({
                where: {
                    email: newUser.email
                }
            });
            if (user) {
                res.status(409).send(req.t("errors.userAlreadyExists"));
                return;
            } 
            newUser.password = await hashPassword(newUser.password);
            const userData = await prisma.user.create({
                data: {
                    ...newUser,
                    role: Role.UNCONFIRMED_USER,
                    preferences: {
                        create: USER_PREFERENCES_DEFAULTS
                    },
                },
                include: {
                    preferences: true
                }
            });
            const tokenData = UserToTokenData(User$.parse(userData));
            const accessToken = generateAccessToken(tokenData);
            const refreshToken = generateRefreshToken(tokenData);
            try {
                await sendVerificationEmail(userData.email, generateVerificationToken(tokenData), req.t)
            } catch (error) {
                catchError(logger, LEVEL.warn)(error, {
                    message: 'Failed to send email',
                    path: 'POST /register',
                    metadata: {
                        user: userData
                    }
                });
            }
            res.cookie(`refreshToken_${env.NODE_ENV}`, refreshToken, {
                httpOnly: true,
                secure: isNodeEnv(NODE_ENV.PROD),
                sameSite: 'strict',
                maxAge: 30 * 24 * 60 * 60 * 1000,
            }).send(accessToken);
        } catch (error) {
            catchError(logger)(error, {
                message: 'Internal server error',
                path: 'POST /register',
                status: 500
            });
            res.status(500).send(req.t("errors.internalServerError"));
        }
    }
);