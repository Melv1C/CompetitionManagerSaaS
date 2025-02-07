import { Router } from 'express';
import { prisma } from '@competition-manager/prisma';
import { Eid$, Role, Inscription$ } from '@competition-manager/schemas';
import { AuthentificatedRequest, Key, parseRequest, checkRole, catchError } from '@competition-manager/backend-utils';
import { z } from 'zod';
import { logger } from '../logger';

export const router = Router();

const Query$ = z.object({
    competitionEid: Eid$.nullish()
});

router.get(
    '/me/inscriptions',
    parseRequest(Key.Query, Query$),
    checkRole(Role.USER),
    async (req: AuthentificatedRequest, res) => {
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
            res.send(Inscription$.array().parse(inscriptions));
        } catch(error) {
            catchError(logger)(error, {
                message: 'Internal server error',
                path: 'GET /me/inscriptions',
                userId: req.user?.id,
                status: 500
            });
            res.status(500).send('internalServerError');
        }
    }
);