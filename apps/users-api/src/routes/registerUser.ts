import { Router } from 'express';
import bcrypt from 'bcrypt';
import { prisma } from '@competition-manager/prisma';
import { parseRequest, generateAccessToken, generateRefreshToken, generateVerificationToken, Key, sendEmail } from '@competition-manager/utils';
import { User$, UserWithoutId$, BaseUser$, USER_PREFERENCES_DEFAULTS, Email$ } from '@competition-manager/schemas';
import { UserToTokenData } from '../utils';

export const router = Router();

const sendVerificationEmail = (email: string, verificationToken: string) => {
    if (!process.env.BASE_URL) {
        throw new Error('BASE_URL not set');
    }
    const url = new URL(process.env.BASE_URL);
    url.pathname = `${process.env.PREFIX}/users/verify-email`;
    url.searchParams.set('token', verificationToken);
    const emailData = Email$.parse({
        to: email,
        subject: 'Verify your email',
        html: `<a href="${url.toString()}">Click here to verify your email</a>`
    });
    sendEmail(emailData);
}


router.post(
    '/register',
    parseRequest(Key.Body, BaseUser$),
    async (req, res) => {
        try {
            const newUser = UserWithoutId$.parse(req.body);
            const user = await prisma.user.findUnique({
                where: {
                    email: newUser.email
                }
            });
            if (user) {
                res.status(409).json({ message: 'Email already in use' });
                return;
            } 
            newUser.password = await bcrypt.hash(newUser.password, 10);
            const userData = await prisma.user.create({
                data: {
                    ...newUser,
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
            sendVerificationEmail(userData.email, generateVerificationToken(tokenData));
            res.cookie('refreshToken', refreshToken, {
                httpOnly: true,
                secure: process.env.NODE_ENV === 'production',
                sameSite: 'strict',
                maxAge: 30 * 24 * 60 * 60 * 1000,
            }).send(accessToken);
        } catch (error) {
            console.error(error);
            res.status(500).json({ message: 'Internal server error' });
        }
    }
);