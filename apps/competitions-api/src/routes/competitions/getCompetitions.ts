import { Router } from 'express';
import { prisma } from '@competition-manager/prisma';
import { DisplayCompetition$, Role, Date$, AdminQuery$ } from '@competition-manager/schemas';
import { AuthenticatedRequest, Key, parseRequest, setUserIfExist } from '@competition-manager/backend-utils';
import { isAuthorized } from '@competition-manager/utils';

export const router = Router();

const Query$ = AdminQuery$.extend({
    fromDate: Date$.optional(),
    toDate: Date$.optional(),
});

router.get(
    '/',
    parseRequest(Key.Query, Query$),
    setUserIfExist,
    async (req: AuthenticatedRequest, res) => {
        try {
            const { isAdmin, toDate, fromDate } = Query$.parse(req.query);
            if (isAdmin && !req.user) {
                res.status(401).send('Unauthorized');
                return;
            }
            if (isAdmin) {
                if (req.user!.role === Role.SUPERADMIN) {
                    const competitions = await prisma.competition.findMany({
                        where: {
                            date: {
                                gte: fromDate,
                                lte: toDate,
                            }
                        },
                    });
                    res.send(DisplayCompetition$.array().parse(competitions));
                    return;
                } else if (isAuthorized(req.user!, Role.ADMIN)) {
                    const admins = await prisma.admin.findMany({
                        where: {
                            userId: req.user!.id,
                            competition: {
                                isDeleted: false,
                                date: {
                                    gte: fromDate,
                                    lte: toDate,
                                }
                            }
                        },
                        select: {
                            competition: true
                        },
                    });
                    res.send(DisplayCompetition$.array().parse(admins.map(admin => admin.competition)));
                    return;
                }
            }
            const competitions = await prisma.competition.findMany({
                where: {
                    publish: true,
                    isDeleted: false,
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