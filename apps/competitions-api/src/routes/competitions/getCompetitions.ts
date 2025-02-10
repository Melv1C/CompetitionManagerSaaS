import { Router } from 'express';
import { prisma } from '@competition-manager/prisma';
import { DisplayCompetition$, Role, Date$, AdminQuery$ } from '@competition-manager/schemas';
import { catchError, CustomRequest, Key, parseRequest, setUserIfExist } from '@competition-manager/backend-utils';
import { isAuthorized } from '@competition-manager/utils';
import { logger } from '../../logger';

export const router = Router();

const Query$ = AdminQuery$.extend({
    fromDate: Date$.optional(),
    toDate: Date$.optional(),
});

router.get(
    '/',
    parseRequest(Key.Query, Query$),
    setUserIfExist,
    async (req: CustomRequest, res) => {
        try {
            const { isAdmin, toDate, fromDate } = Query$.parse(req.query);
            if (isAdmin && (!req.user || !isAuthorized(req.user, Role.ADMIN))) {
                res.status(401).send(req.t('errors.unauthorized'));
                return;
            }

            if (isAdmin && isAuthorized(req.user!, Role.SUPERADMIN)) {
                const competitions = await prisma.competition.findMany({
                    where: {
                        date: {
                            gte: fromDate,
                            lte: toDate,
                        }
                    },
                    include: {
                        club: true,
                    }
                });
                res.send(DisplayCompetition$.array().parse(competitions));
                return;
            } 
                
            if (isAdmin) { 
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
                        competition: {
                            include: {
                                club: true,
                            }
                        }
                    },
                });
                res.send(DisplayCompetition$.array().parse(admins.map(admin => admin.competition)));
                return;
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
                include: {
                    club: true,
                }
            });
            res.send(DisplayCompetition$.array().parse(competitions));
        }catch (e) {
            catchError(logger)(e, {
                message: 'Internal server error',
                path: 'GET /',
                userId: req.user?.id,
                status: 500,
            });
            res.status(500).send(req.t('errors.internalServerError'));
        }
    }
);