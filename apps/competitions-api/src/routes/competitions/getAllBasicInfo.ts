import { Router } from 'express';
import { prisma } from '@competition-manager/prisma';

export const router = Router();

router.get(
    '/',
    async (req, res) => {
        const competitions = await prisma.competition.findMany({
            where: {
                publish: true,
            },
            select: {
                name: true,
                date: true,
            }
        });
        res.send(competitions);
    }
);