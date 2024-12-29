import { Router } from 'express';
import { parseRequest, sendEmail, generateResetPasswordToken, Key } from '@competition-manager/utils';
import { Email$, TokenData$ } from '@competition-manager/schemas';
import { prisma } from '@competition-manager/prisma';
import { z } from 'zod';

export const router = Router();

const sendRestPasswordEmail = async (email: string, token: string) => {
    if (!process.env.BASE_URL) {
        throw new Error('BASE_URL not set');
    }
    const url = new URL(process.env.BASE_URL);
    url.pathname = `${process.env.PREFIX}/users/reset-password`;
    url.searchParams.set('token', token);
    const emailData = Email$.parse({
        to: email,
        subject: 'Verify your email',
        html: `<a href="${url.toString()}">Click here to reset your password</a>`
    });
    sendEmail(emailData);
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
            sendRestPasswordEmail(user.email, generateResetPasswordToken(TokenData$.parse(user)));
            res.send('Email sent');
        } catch (error) {
            console.error(error);
            res.status(500).send('Internal server error');
        }
    }
);