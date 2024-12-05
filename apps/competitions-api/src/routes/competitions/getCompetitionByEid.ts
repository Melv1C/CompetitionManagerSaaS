import { Router } from 'express';
import { prisma } from '@competition-manager/prisma';
import { parseRequest } from '@competition-manager/utils';
import { Competition$ } from '@competition-manager/schemas';

export const router = Router();

const Params$ = Competition$.pick({
    eid: true,
});

router.get(
    '/:eid',
    parseRequest('params', Params$),
    async (req, res) => {
        const { eid } = Params$.parse(req.params);
        const competition = await prisma.competition.findUnique({
            where: {
                eid,
                publish: true
            },
            select: {
                name: true,
                date: true,
                description: true,
                startInscriptionDate: true,
                endInscriptionDate: true,
                email: true,
                closeDate: true,
                oneDayPermissions: true,
                oneDayBibStart: true,
                events: true,
            }

        });
        if (!competition) {
            res.status(404).send('Competition not found');
            return;
        }
        res.send(competition);
    }
);