import { Router } from 'express';
import { prisma } from '@competition-manager/prisma';
import { DisplayCompetition$ } from '@competition-manager/schemas';

export const router = Router();

router.get(
    '/',
    async (req, res) => {
        try {
            const competitions = await prisma.competition.findMany({
                where: {
                    publish: true,
                },
            });
            res.send(DisplayCompetition$.array().parse(competitions));
        }catch (e) {
            console.error(e);
            res.status(500).send('Internal server error');
        }
    }
);