import { Router } from 'express';
import { z } from 'zod';
import bcrypt from 'bcrypt';

import { prisma } from '@competition-manager/prisma';
import { parseRequest, generateAccessToken, generateRefreshToken } from '@competition-manager/utils';

export const router = Router();

const Body$ = z.object({
    email: z.string({ message: 'Email must be a string' }).email({ message: 'Email must be a valid email' }),
    password: z.string({ message: 'Password must be a string' }).min(8, { message: 'Password must be at least 8 characters long' })
});

router.post(
    '/register',
    parseRequest('body', Body$),
    async (req, res) => {
        const { email, password } = Body$.parse(req.body);
        const user = await prisma.user.findUnique({
            where: {
                email: email
            }
        });
        if (user) {
            res.status(409).json({ message: 'Email already in use' });
            return;
        } 
        const hashedPassword = await bcrypt.hash(password, 10);
        await prisma.user.create({
            data: {
                email,
                password: hashedPassword,
                preferences: {
                    create: {
                        theme: 'light',
                        language: 'fr'
                    }
                },
                role: 'user'
            }
        });

        const accessToken = generateAccessToken(email);
        const refreshToken = generateRefreshToken(email);
        res.cookie('refreshToken', refreshToken, {
            httpOnly: true,
            secure: true,
            sameSite: 'strict',
            maxAge: 30 * 24 * 60 * 60 * 1000,
        }).send(accessToken);
    }
);