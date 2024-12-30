import { Router } from 'express';
import { prisma } from '@competition-manager/prisma';
import { Key, parseRequest, setUserIfExist, AuthenticatedRequest, isAuthorized } from '@competition-manager/utils';
import { Eid$, Role, Competition$ } from '@competition-manager/schemas';
import { z } from 'zod';

export const router = Router();

const competitionQuery = {
    include: {
        events: true,
        paymentPlan: {
            include: {
                includedOptions: true,
            },
        },
        options: true,
        admins: {
            include: {
                user: true,
            },
        },
        freeClubs: true,
    },
};

const Params$ = z.object({
    competitionEid: Eid$,
});

const Query$ = z.object({
    isAdmin: z.coerce.boolean().default(false),
});

router.get(
    '/:competitionEid',
    parseRequest(Key.Params, Params$),
    parseRequest(Key.Query, Query$),
    setUserIfExist(),
    async (req: AuthenticatedRequest, res) => {
        const { isAdmin } = Query$.parse(req.query);
        const { competitionEid } = Params$.parse(req.params);
        if (isAdmin && !req.user) {
            res.status(401).send('Unauthorized');
            return;
        }
        if (req.user!.role === Role.SUPERADMIN) {
            const competition = await prisma.competition.findUnique({
                where: {
                    eid: competitionEid,
                },
                ...competitionQuery
            });
            if (!competition) {
                res.status(404).send('Competition not found');
                return;
            }
            res.send(Competition$.parse(competition));
            return;
        }
        if (isAdmin && isAuthorized(req.user!, Role.ADMIN)) {
            const admin = await prisma.admin.findFirst({
                where: {
                    userId: req.user!.id,
                    competition: {
                        eid: competitionEid,
                    },
                },
                select: {
                    competition: {
                        ...competitionQuery
                    },
                },
            });
            if (!admin) {
                res.status(404).send('Competition not found');
                return;
            }
            res.send(Competition$.parse(admin.competition));
            return;
        }

        const competition = await prisma.competition.findUnique({
            where: {
                eid: competitionEid,
                publish: true
            },
            ...competitionQuery
        });
        if (!competition) {
            res.status(404).send('Competition not found');
            return;
        }
        res.send(Competition$.parse(competition));
    }
);