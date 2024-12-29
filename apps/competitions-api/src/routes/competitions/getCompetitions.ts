import { Router } from 'express';
import { prisma } from '@competition-manager/prisma';
import { DisplayCompetition$, Role, Date$ } from '@competition-manager/schemas';
import { z } from 'zod';
import { AuthenticatedRequest, isAuthorized, Key, parseRequest, setUserIfExist } from '@competition-manager/utils';

export const router = Router();

const Query$ = z.object({
    isAdmin: z.coerce.boolean().default(false),
    fromDate: Date$.optional(),
    toDate: Date$.optional(),
});

router.get(
    '/',
    parseRequest(Key.Params, Query$),
    setUserIfExist(),
    async (req: AuthenticatedRequest, res) => {
        try {
            const { isAdmin, toDate, fromDate } = Query$.parse(req.query);
            if (isAdmin && req.user! && isAuthorized(req.user, Role.ADMIN)) {
                const admins = await prisma.admin.findMany({
                    where: {
                        userId: req.user!.id,
                    },
                    select: {
                        competitionId: true,
                    },
                });
                const competitions = await prisma.competition.findMany({
                    where: {
                        id: {
                            in: admins.map((a) => a.competitionId),
                        },
                        date: {
                            gte: fromDate,
                            lte: toDate,
                        }
                    },
                });
                res.send(DisplayCompetition$.array().parse(competitions));
                return;
            }
            
            const competitions = await prisma.competition.findMany({
                where: {
                    publish: true,
                    date: {
                        gte: fromDate,
                        lte: toDate,
                    }
                },
            });
            res.send(DisplayCompetition$.array().parse(competitions));
        }catch (e) {
            console.error(e);
            res.status(500).send('Internal server error');
        }
    }
);