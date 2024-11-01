
import { Router } from 'express';
import { z } from 'zod';

import { prisma } from '@competition-manager/prisma';
import { parseRequest } from '@competition-manager/utils';

export const router = Router();

const Params$ = z.object({
    firebaseId: z.string({ message: 'Firebase ID must be a string' }).min(1, { message: 'Firebase ID must not be empty' })
});

router.get(
    '/:firebaseId',
    parseRequest('params', Params$), 
    async (req, res) => {
        const { firebaseId } = Params$.parse(req.params);
        const user = await prisma.user.findUnique({
            where: {
                firebaseId: firebaseId
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