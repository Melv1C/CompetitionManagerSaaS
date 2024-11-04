import { Router } from 'express';
import { z } from 'zod';

import { prisma } from '@competition-manager/prisma';
import { parseRequest } from '@competition-manager/utils';

export const router = Router();

const Params$ = z.object({
    email: z.string({ message: 'Email must be a string' }).email({ message: 'Email must be a valid email' })
});

router.get(
    '/:email',
    parseRequest('params', Params$), 
    async (req, res) => {
        const { email } = Params$.parse(req.params);
        const user = await prisma.user.findUnique({
            where: {
                email: email
            },
            include: {
                preferences: true
            }
        });

        if (!user) {
            res.status(404).send('User not found');
            return;
        }

        res.send(user);
    }
);