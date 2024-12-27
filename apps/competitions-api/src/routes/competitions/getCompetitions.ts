import { Router } from 'express';
import { prisma } from '@competition-manager/prisma';
import { DisplayCompetition$, Role } from '@competition-manager/schemas';
import { z } from 'zod';
import { AuthenticatedRequest, checkRole, Key, parseRequest } from '@competition-manager/utils';

export const router = Router();

const Params$ = z.object({
    isAdmin: z.boolean().optional(),
});

router.get(
    '/',
    parseRequest(Key.Params, Params$),
    checkRole(Role.USER),
    async (req: AuthenticatedRequest, res) => {
        try {
            let competitions;
            if (req.params.isAdmin) {
                const admins = await prisma.admin.findMany({
                    where: {
                        userId: req.user!.id,
                    },
                    select: {
                        competitionId: true,
                    },
                });
                competitions = await prisma.competition.findMany({
                    where: {
                        id: {
                            in: admins.map((a) => a.competitionId),
                        },
                    },
                });
            }else{
                competitions = await prisma.competition.findMany({
                    where: {
                        publish: true,
                    },
                });
            }
            res.send(DisplayCompetition$.array().parse(competitions));
        }catch (e) {
            console.error(e);
            res.status(500).send('Internal server error');
        }
    }
);