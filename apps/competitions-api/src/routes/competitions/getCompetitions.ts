import { Router } from 'express';
import { prisma } from '@competition-manager/prisma';
import { DisplayCompetition$, Role } from '@competition-manager/schemas';
import { z } from 'zod';
import { AuthenticatedRequest, checkRole, Key, parseRequest } from '@competition-manager/utils';

export const router = Router();

const Query$ = z.object({
    isAdmin: z.boolean().default(false),
});

router.get(
    '/',
    parseRequest(Key.Params, Query$),
    checkRole(Role.ADMIN, Key.Query, 'isAdmin'),
    async (req: AuthenticatedRequest, res) => {
        try {
            if (req.query.isAdmin) {
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
                    },
                });
                res.send(DisplayCompetition$.array().parse(competitions));
                return;
            }
            
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