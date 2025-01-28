import { Router } from 'express';
import { prisma } from '@competition-manager/prisma';
import { Eid$, Role, UserInscription$ } from '@competition-manager/schemas';
import { AuthenticatedRequest, Key, parseRequest, checkRole } from '@competition-manager/backend-utils';
import { z } from 'zod';

export const router = Router();

const Query$ = z.object({
    competitionEid: Eid$.nullish()
});

router.get(
    '/me/inscriptions',
    parseRequest(Key.Query, Query$),
    checkRole(Role.USER),
    async (req: AuthenticatedRequest, res) => {
        try {
            const { competitionEid } = Query$.parse(req.query);
            const inscriptions = await prisma.inscription.findMany({
                where: {
                    userId: req.user?.id,
                    competition: {
                        eid: competitionEid ?? undefined
                    }
                },
                include: {
                    athlete: true,
                    competitionEvent: {
                        include: {
                            event: true,
                            categories: true
                        }
                    },
                    user: true,
                    club: true,
                    record: true
                }
            });
            if (!inscriptions) {
                res.status(404).send('Competition not found');
                return;
            }
            res.send(UserInscription$.array().parse(inscriptions));
        } catch(error) {
            console.error(error);
            res.status(500).send('Internal server error');
        }
    }
);