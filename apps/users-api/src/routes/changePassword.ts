import { Router } from 'express';
import { parseRequest, Key, catchError, checkRole, AuthentificatedRequest, comparePassword, hashPassword } from '@competition-manager/backend-utils';
import { Password$, Role } from '@competition-manager/schemas';
import { z } from 'zod';
import { logger } from '../logger';
import { prisma } from '@competition-manager/prisma';

export const router = Router();


const Body$ = z.object({
    oldPassword: Password$,
    newPassword: Password$,
});

router.post(
    '/change-password',
    parseRequest(Key.Body, Body$),
    checkRole(Role.UNCONFIRMED_USER),
    async (req : AuthentificatedRequest, res) => {
        try {
            const { oldPassword, newPassword } = Body$.parse(req.body);
            const user = await prisma.user.findUnique({
                where: {
                    id: req.user!.id
                }
            });
            if (!user) {
                res.status(404).send(req.t('errors.userNotFound'));
                return;
            }
            const valid = await comparePassword(oldPassword, user.password);
            if (!valid) {
                res.status(400).send(req.t('errors.invalidPassword'));
                return;
            }
            await prisma.user.update({
                where: {
                    id: user.id
                },
                data: {
                    password: await hashPassword(newPassword)
                }
            });
            res.send(req.t('success.passwordChanged'));
        } catch (error) {
            catchError(logger)(error, {
                message: 'Internal server error',
                path: 'POST /change-password',
                status: 500
            });
            res.status(500).send(req.t('errors.internalServerError'));
        }
    }
);