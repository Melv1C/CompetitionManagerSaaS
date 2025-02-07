import { Router } from 'express';
import { parseRequest, verifyResetPasswordToken, Key, hashPassword, catchError } from '@competition-manager/backend-utils';
import { EncodeToken$ } from '@competition-manager/schemas';
import { prisma } from '@competition-manager/prisma';
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
                res.status(401).send("invalidToken");
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
                res.send('Password updated');
            } catch (e: any) {
                if (e.code === 'P2025') {
                    res.status(404).send('updateUserRouter');
                    return;
                } else{
                    catchError(logger)(e, {
                        message: 'Internal server error',
                        path: 'POST /reset-password',
                        status: 500
                    });
                    res.status(500).send('internalServerError');
                    return;
                }
            }
        } catch (error) {
            catchError(logger)(error, {
                message: 'Internal server error',
                path: 'POST /reset-password',
                status: 500
            });
            res.status(500).send('internalServerError');
        }
    }
);