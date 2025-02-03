import { Router } from 'express';
import { parseRequest, sendEmail, generateResetPasswordToken, Key } from '@competition-manager/backend-utils';
import { Email, EmailData$, LogInfo, LogInfo$, TokenData$ } from '@competition-manager/schemas';
import { prisma } from '@competition-manager/prisma';
import { z } from 'zod';
import { env, logger } from '..';
import { catchError } from '@competition-manager/backend-utils/src/logger';

export const router = Router();

const sendRestPasswordEmail = (email: Email, token: string) => {
    const url = new URL(env.BASE_URL);
    url.pathname = `/reset-password`;
    url.searchParams.set('token', token);
    const emailData = EmailData$.parse({
        to: email,
        subject: 'Verify your email',
        html: `<a href="${url.toString()}">Click here to reset your password</a>`
    });
    return sendEmail(emailData);
}

const Body$ = z.object({
    email: z.string().email(),
});

router.post(
    '/forgot-password',
    parseRequest(Key.Body, Body$),
    async (req, res) => {
        try {
            const { email } = Body$.parse(req.body);
            const user = await prisma.user.findUnique({
                where: {
                    email
                },
                include: {
                    preferences: true
                }
            });
            if (!user) {
                res.status(404).json({ message: 'No account found with this email'});
                return;
            }
            if (!await sendRestPasswordEmail(user.email, generateResetPasswordToken(TokenData$.parse(user)))) {
                logger.warn('Failed to send email', {
                    path: 'POST /forgot-password',
                    status: 500,
                    metadata: {
                        user: user,
                    }
                });
                res.status(500).send('Failed to send email');
                return;
            }
            res.send('Email sent');
        } catch (error) {
            catchError(logger)(error, {
                message: 'Internal server error',
                path: 'POST /forgot-password',
                status: 500
            });
            res.status(500).send('Internal server error');
        }
    }
);