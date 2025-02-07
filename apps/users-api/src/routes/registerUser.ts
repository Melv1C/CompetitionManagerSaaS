import { Router } from 'express';
import { prisma } from '@competition-manager/prisma';
import { parseRequest, generateAccessToken, generateRefreshToken, generateVerificationToken, Key, hashPassword, isNodeEnv, catchError } from '@competition-manager/backend-utils';
import { User$, CreateUser$, USER_PREFERENCES_DEFAULTS, Role, NODE_ENV } from '@competition-manager/schemas';
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
                res.status(409).json("userAlreadyExists");
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
            if (!await sendVerificationEmail(userData.email, generateVerificationToken(tokenData))) {
                logger.warn('Failed to send email', {
                    path: 'POST /register',
                    status: 500,
                    metadata: {
                        user: userData,
                    }
                });
            }
            res.cookie('refreshToken', refreshToken, {
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
            res.status(500).send("internalServerError");
        }
    }
);