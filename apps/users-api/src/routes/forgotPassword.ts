import { Router } from 'express';
import { parseRequest, sendEmail, generateResetPasswordToken, Key, catchError } from '@competition-manager/backend-utils';
import { Email, Email$, EmailData$, TokenData$ } from '@competition-manager/schemas';
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
        <h2>${t("mail:resetPassword.title")}</h2>
        <p>${t("mail:resetPassword.intro")}</p>
        <a href="${url.toString()}">${t("mail:resetPassword.button")}</a>
        <p>${t("mail:resetPassword.ignore")}</p>
        <p>${t("mail:mailSignature")}</p>
    `;
    const emailData = EmailData$.parse({
        to: email,
        subject: t("mail:resetPassword.title"),
        html: html
    });
    await sendEmail(emailData);
}

const Body$ = z.object({
    email: Email$
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
                res.status(404).send(req.t('errors.userNotFound'));
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
                res.status(500).send(req.t('errors.failedToSendEmail'));
                return;
            }
            res.send(req.t('success.resetPasswordEmailSent'));
        } catch (error) {
            catchError(logger)(error, {
                message: 'Internal server error',
                path: 'POST /forgot-password',
                status: 500
            });
            res.status(500).send(req.t('errors.internalServerError'));
        }
    }
);