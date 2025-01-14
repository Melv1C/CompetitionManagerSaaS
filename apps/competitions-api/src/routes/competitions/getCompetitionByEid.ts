import { Router } from 'express';
import { prisma } from '@competition-manager/prisma';
import { Key, parseRequest, setUserIfExist, AuthenticatedRequest } from '@competition-manager/backend-utils';
import { isAuthorized } from '@competition-manager/utils';
import { Eid$, Role, Competition$ } from '@competition-manager/schemas';
import { z } from 'zod';

export const router = Router();

const competitionQuery = {
    include: {
        events: {
            include: {
                categories: true,
                event: true,
            },
        },
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
    setUserIfExist,
    async (req: AuthenticatedRequest, res) => {
        try {
            const { isAdmin } = Query$.parse(req.query);
            const { competitionEid } = Params$.parse(req.params);
            if (isAdmin) {
                if (!req.user) {
                    res.status(401).send('Unauthorized');
                    return;
                }
                if (req.user.role === Role.SUPERADMIN) {
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
                if (isAuthorized(req.user, Role.ADMIN)) {
                    const admin = await prisma.admin.findFirst({
                        where: {
                            userId: req.user!.id,
                            competition: {
                                eid: competitionEid,
                                isDeleted: false,
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
            }
            
            const competition = await prisma.competition.findUnique({
                where: {
                    eid: competitionEid,
                    publish: true,
                    isDeleted: false,
                },
                ...competitionQuery,
                include: {
                    paymentPlan: true,
                    options: true,
                    admins: {
                        include: {
                            user: {
                                include: {
                                    preferences: true
                                }
                            }
                        }
                    },
                    club: true,
                },
            });
            if (!competition) {
                res.status(404).send('Competition not found');
                return;
            }
            res.send(Competition$.parse(competition));
        } catch (error) {
            console.error(error);
            res.status(500).send('Internal server error');
        }
    }
);