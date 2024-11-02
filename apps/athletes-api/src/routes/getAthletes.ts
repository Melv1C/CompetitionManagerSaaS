import { Router } from 'express';
import { z } from 'zod';

import { prisma } from '@competition-manager/prisma';
import { parseRequest } from '@competition-manager/utils';

export const router = Router();

const Query$ = z.object({
    key: z.string().min(3, {message: 'Key must be at least 3 characters long'})
});

router.get(
    '',
    parseRequest('query', Query$), 
    async (req, res) => {
        const { key } = Query$.parse(req.query);
        const athletes = await prisma.athlete.findMany({
            where: {
                firstName: {
                    startsWith: key
                }
            }
        });
        if (!athletes.length) {
            res.status(404).send('No athlete found');
            return;
        }
        res.send(athletes);
    }
);
