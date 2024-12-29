import { Router } from 'express';
import bcrypt from 'bcrypt';
import { parseRequest, verifyResetPasswordToken, Key } from '@competition-manager/utils';
import { EncodeToken$ } from '@competition-manager/schemas';
import { prisma } from '@competition-manager/prisma';
import { z } from 'zod';

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
    async (req, res) => {
        try {
            const { token } = Query$.parse(req.query);
            const tokenData = verifyResetPasswordToken(token);
            const { newPassword } = Body$.parse(req.body);
            if (!tokenData) {
                res.status(401).json({ message: 'Invalid or expired token' });
                return;
            }
            const user = await prisma.user.findUnique({
                where: {
                    email: tokenData.email
                }
            });
            if (!user) {
                res.status(404).json({ message: 'No account found with this email' });
                return;
            }
            const hashedPassword = await bcrypt.hash(newPassword, 10);
            await prisma.user.update({
                where: {
                    id: user.id
                },
                data: {
                    password: hashedPassword
                }
            });
            res.send('Password updated');
        } catch (error) {
            console.error(error);
            res.status(500).send('Internal server error');
        }
    }
);