import { Router } from 'express';
import { prisma } from '@competition-manager/prisma';
import { Key, parseRequest, checkRole, AuthenticatedRequest } from '@competition-manager/utils';
import { Eid$, Role, AdminCompetition$ } from '@competition-manager/schemas';
import { z } from 'zod';

export const router = Router();

const Params$ = z.object({
    competitionEid: Eid$,
});

const Query$ = z.object({
    isAdmin: z.boolean().default(false),
});

router.get(
    '/:competitionEid',
    parseRequest(Key.Params, Params$),
    parseRequest(Key.Query, Query$),
    checkRole(Role.ADMIN, Key.Query, 'isAdmin'),
    async (req: AuthenticatedRequest, res) => {
        const { competitionEid } = Params$.parse(req.params);
        if (req.query.isAdmin) {
            const admin = await prisma.admin.findFirst({
                where: {
                    userId: req.user!.id,
                    competition: {
                        eid: competitionEid,
                    },
                },
                select: {
                    competition: {
                        include: {
                            events: true,
                            paymentPlan: {
                                include: {
                                    includedOptions: true,
                                },
                            },
                            options: true,
                        },
                    },
                },
            });
            if (!admin) {
                res.status(404).send('Competition not found');
                return;
            }
            res.send(AdminCompetition$.parse(admin.competition));
        }

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