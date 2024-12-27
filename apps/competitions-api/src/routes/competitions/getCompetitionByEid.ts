import { Router } from 'express';
import { prisma } from '@competition-manager/prisma';
import { Key, parseRequest } from '@competition-manager/utils';
import { Eid$ } from '@competition-manager/schemas';
import { z } from 'zod';

export const router = Router();

const Params$ = z.object({
    competitionEid: Eid$
});

router.get(
    '/:competitionEid',
    parseRequest(Key.Params, Params$),
    async (req, res) => {
        const { competitionEid } = Params$.parse(req.params);
        const competition = await prisma.competition.findUnique({
            where: {
                eid: competitionEid,
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
            },
        });
        if (!competition) {
            res.status(404).send('Competition not found');
            return;
        }
        res.send(competition);
    }
);