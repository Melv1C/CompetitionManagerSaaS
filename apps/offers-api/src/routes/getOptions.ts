import { prisma } from '@competition-manager/prisma';
import { Option$ } from '@competition-manager/schemas';
import { Router } from 'express';

export const router = Router();

router.get(
    '/options',
    async (req, res) => {
        const options = await prisma.option.findMany();
        res.send(Option$.array().parse(options));
    }
)

