import { Router } from 'express';
import { z } from 'zod';
import bcrypt from 'bcrypt';
import { prisma } from '@competition-manager/prisma';
import { parseRequest } from '@competition-manager/utils';
import { generateAccessToken, generateRefreshToken } from './utils';

export const router = Router();

const Body$ = z.object({
    email: z.string({ message: 'Email must be a string' }).email({ message: 'Email must be a valid email' }),
    password: z.string({ message: 'Password must be a string' })
});

router.post(
    '/login',
    parseRequest('body', Body$),
    async (req, res) => {
        const { email, password } = Body$.parse(req.body);
        const user = await prisma.user.findUnique({
            where: {
                email: email
            }
        });
        if (!user) {
            res.status(401).json({ message: 'Invalid credentials' });
            return;
        }
        const valid = await bcrypt.compare(password, user.password);
        if (!valid) {
            res.status(401).json({ message: 'Invalid credentials' });
            return;
        }
        const accessToken = generateAccessToken(email);
        const refreshToken = generateRefreshToken(email);
        res.cookie('refreshToken', refreshToken, {
            httpOnly: true,
            secure: true,
            sameSite: 'strict',
            maxAge: 30 * 24 * 60 * 60 * 1000,   // 30 days
        }).send(accessToken);
    }
);