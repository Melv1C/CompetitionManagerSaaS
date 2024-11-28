import { Router } from 'express';
import { z } from 'zod';
import bcrypt from 'bcrypt';
import { rateLimit } from 'express-rate-limit'
import { prisma } from '@competition-manager/prisma';
import { parseRequest, generateAccessToken, generateRefreshToken } from '@competition-manager/utils';
import { User$ } from '@competition-manager/schemas';
import { UserToTokenData } from '../utils';

export const router = Router();


const loginLimiter = rateLimit({
	windowMs: 15 * 60 * 1000, // 15 minutes
	limit: 3, // Limit each IP to 100 requests per `window` (here, per 15 minutes).
	legacyHeaders: false, // Do not show limit, remaning, reset in respond headers 
    message: 'Too many login request, please try again later.',
    skipSuccessfulRequests: true,  // By default all response with code below 400 are considered successful
    statusCode: 429
})

const Body$ = z.object({
    email: z.string({ message: 'Email must be a string' }).email({ message: 'Email must be a valid email' }),
    password: z.string({ message: 'Password must be a string' })
});

router.post(
    '/login',
    loginLimiter,
    parseRequest('body', Body$),
    async (req, res) => {
        const { email, password } = Body$.parse(req.body);
        const user = await prisma.user.findUnique({
            where: {
                email: email
            },
            include: {
                preferences: true
            }
        });
        if (!user) {
            res.status(400).json({ message: 'Invalid email' });
            return;
        }
        const valid = await bcrypt.compare(password, user.password);
        if (!valid) {
            res.status(400).json({ message: 'Invalid password' });
            return;
        }
        const tokenData = UserToTokenData(User$.parse(user));
        const accessToken = generateAccessToken(tokenData);
        const refreshToken = generateRefreshToken(tokenData);
        res.cookie('refreshToken', refreshToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'strict',
            maxAge: 30 * 24 * 60 * 60 * 1000,   // 30 days
        }).send(accessToken);
    }
);