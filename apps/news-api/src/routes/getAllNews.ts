import { prisma } from '@competition-manager/prisma';
import { News$ } from '@competition-manager/schemas';
import { Router } from 'express';

export const router = Router();

router.get(
    '/',
    async (req, res) => {
        const news = await prisma.news.findMany({
            orderBy: {
                createdAt: 'desc'
            }
        });

        res.send(News$.array().parse(news));
    }
);