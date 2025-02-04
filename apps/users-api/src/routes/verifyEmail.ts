import { Router } from 'express';
import { z } from 'zod';
import { prisma } from '@competition-manager/prisma';
import { parseRequest, Key, verifyVerificationToken, catchError } from '@competition-manager/backend-utils';
import { EncodeToken$, Role } from '@competition-manager/schemas';
import { env } from '../env';
import { logger } from '../logger';

export const router = Router();

const Query$ = z.object({
    token: EncodeToken$
});

router.get(
    '/verify-email',
    parseRequest(Key.Query, Query$),
    async (req, res) => {
        try {
            const { token } = Query$.parse(req.query);
            const tokenData = verifyVerificationToken(token);
            if (!tokenData) {
                res.status(400).send('Invalid token');
                return;
            }
            const user = await prisma.user.findUnique({
                where: {
                    id: tokenData.id
                }
            });
            if (!user) {
                res.status(404).send('User not found');
                return;
            }
            if (user.role !== Role.UNCONFIRMED_USER) {
                res.status(400).send('User already verified');
                return;
            }
            await prisma.user.update({
                where: {
                    id: user.id
                },
                data: {
                    role: Role.USER
                },
                include: {
                    preferences: true
                }
            });
            // Redirect to account page
            res.redirect(`${env.BASE_URL}/account`);
        } catch (error) {
            catchError(logger)(error, {
                message: 'Internal server error',
                path: 'GET /verify-email',
                status: 500
            });
            res.status(500).json({ message: 'Internal server error' });
        }
    }
);