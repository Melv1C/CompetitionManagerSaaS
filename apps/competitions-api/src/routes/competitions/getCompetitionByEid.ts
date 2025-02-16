import { Router } from 'express';
import { prisma } from '@competition-manager/prisma';
import { Key, parseRequest, setUserIfExist, CustomRequest, catchError } from '@competition-manager/backend-utils';
import { isAuthorized } from '@competition-manager/utils';
import { Eid$, Role, Competition$, AdminQuery$, competitionInclude } from '@competition-manager/schemas';
import { z } from 'zod';
import { logger } from '../../logger';

export const router = Router();

const Params$ = z.object({
    competitionEid: Eid$,
});

const Query$ = AdminQuery$;

router.get(
    '/:competitionEid',
    parseRequest(Key.Params, Params$),
    parseRequest(Key.Query, Query$),
    setUserIfExist,
    async (req: CustomRequest, res) => {
        try {
            const { isAdmin } = Query$.parse(req.query);
            const { competitionEid } = Params$.parse(req.params);
            if (isAdmin) {
                if (!req.user) {
                    res.status(401).send(req.t('errors.unauthorized'));
                    return;
                }
                if (req.user.role === Role.SUPERADMIN) {
                    const competition = await prisma.competition.findUnique({
                        where: {
                            eid: competitionEid,
                        },
                        include: competitionInclude,
                    });
                    if (!competition) {
                        res.status(404).send(req.t('errors.competitionNotFound'));
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
                                include: competitionInclude,
                            },
                        },
                    });
                    if (!admin) {
                        res.status(404).send(req.t('errors.competitionNotFound'));
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
                include: competitionInclude,
            });
            if (!competition) {
                res.status(404).send(req.t('errors.competitionNotFound'));
                return;
            }
            res.send(Competition$.parse(competition));
        } catch (error) {
            catchError(logger)(error, {
                message: 'Internal server error',
                path: 'GET /:competitionEid',
                userId: req.user?.id,
                status: 500,
            });
            res.status(500).send(req.t('errors.internalServerError'));
        }
    }
);
