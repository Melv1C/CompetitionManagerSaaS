import { Router } from 'express';
import { parseRequest, sendEmail, generateResetPasswordToken, Key, catchError } from '@competition-manager/backend-utils';
import { Email, EmailData$, TokenData$ } from '@competition-manager/schemas';
import { prisma } from '@competition-manager/prisma';
import { z } from 'zod';
import { env } from '../env';
import { logger } from '../logger';

export const router = Router();

const sendResetPasswordEmail = async (email: Email, token: string, t: (key: string) => string) => {
    const url = new URL(env.BASE_URL);
    url.pathname = `/reset-password`;
    url.searchParams.set('token', token);
    const html = `
        <h2>${t("resetPassword.title")}</h2>
        <p>${t("resetPassword.intro")}</p>
        <a href="${url.toString()}">${t("resetPassword.button")}</a>
        <p>${t("resetPassword.ignore")}</p>
        <p>${t("mailSignature")}</p>
    `;
    const emailData = EmailData$.parse({
        to: email,
        subject: t("resetPassword.title"),
        html: html
    });
    await sendEmail(emailData);
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
                res.status(404).send("userNotFound");
                return;
            }
            try {
                await sendResetPasswordEmail(user.email, generateResetPasswordToken(TokenData$.parse(user)), req.t);
            } catch (error) {
                logger.warn('Failed to send email', {
                    path: 'POST /forgot-password',
                    status: 500,
                    metadata: {
                        user: user,
                    }
                });
                res.status(500).send('failedToSendEmail');
                return;
            }
            res.send('Email sent');
        } catch (error) {
            catchError(logger)(error, {
                message: 'Internal server error',
                path: 'POST /forgot-password',
                status: 500
            });
            res.status(500).send('internalServerError');
        }
    }
);