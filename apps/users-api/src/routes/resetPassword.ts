import { Router } from 'express';
import { parseRequest, verifyResetPasswordToken, Key, hashPassword, catchError } from '@competition-manager/backend-utils';
import { EncodeToken$ } from '@competition-manager/schemas';
import { Prisma, prisma } from '@competition-manager/prisma';
import { z } from 'zod';
import { logger } from '../logger';

export const router = Router();

const Query$ = z.object({
    token: EncodeToken$,
});

const Body$ = z.object({
    newPassword: z.string(),
});

router.post(
    '/reset-password',
    parseRequest(Key.Query, Query$),
    parseRequest(Key.Body, Body$),
    async (req, res) => {
        try {
            const { token } = Query$.parse(req.query);
            const { newPassword } = Body$.parse(req.body);
            const tokenData = verifyResetPasswordToken(token);
            if (!tokenData) {
                res.status(401).send(req.t('errors.invalidToken'));
                return;
            }
            const hashedPassword = await hashPassword(newPassword);
            try {
                await prisma.user.update({
                    where: {
                        id: tokenData.id
                    },
                    data: {
                        password: hashedPassword
                    }
                });
                res.send(req.t('success.passwordChanged'));
            } catch (e) {
                if (e instanceof Prisma.PrismaClientKnownRequestError && e.code === 'P2025') {
                    catchError(logger)(e, {
                        message: 'User not found',
                        path: 'POST /reset-password',
                        status: 404,
                        metadata: {
                            tokenData
                        }
                    });
                    res.status(404).send(req.t('errors.userNotFound'));
                    return;
                }
                throw e;
            }
        } catch (error) {
            catchError(logger)(error, {
                message: 'Internal server error',
                path: 'POST /reset-password',
                status: 500
            });
            res.status(500).send(req.t('errors.internalServerError'));
        }
    }
);