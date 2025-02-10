import { Router } from 'express';
import { prisma } from '@competition-manager/prisma';
import { z } from 'zod';
import { parseRequest, checkRole, checkAdminRole, CustomRequest, Key, catchError } from '@competition-manager/backend-utils';
import { Access, BaseAdmin$, Eid$, Role } from '@competition-manager/schemas';
import { logger } from '../../logger';

export const router = Router();

const Params$ = z.object({
    competitionEid: Eid$
});

router.delete(
    '/:competitionEid',
    parseRequest(Key.Params, Params$),
    checkRole(Role.CLUB),
    async (req: CustomRequest, res) => {
        try{
            const { competitionEid } = Params$.parse(req.params);
            const competition = await prisma.competition.findUnique({
                where: {
                    eid: competitionEid
                },
                include: {
                    admins: {
                        select: {
                            access: true,
                            userId: true
                        }
                    },
                }
            });
            if (!competition) {
                res.status(404).send(req.t('errors.competitionNotFound'));
                return;
            }
            if (req.user!.role != Role.SUPERADMIN && !checkAdminRole(Access.OWNER, req.user!.id, z.array(BaseAdmin$).parse(competition.admins), res, req.t)) {
                return;
            }
            await prisma.competition.update({
                where: {
                    eid: competitionEid
                },
                data: {
                    isDeleted: true
                }
            });
            res.send(req.t('success.competitionDeleted'));
            
        } catch (e) {
            catchError(logger)(e, {
                message: 'Internal server error',
                path: 'DELETE /:competitionEid',
                userId: req.user?.id,
                status: 500,
            });
            res.status(500).send(req.t('errors.internalServerError'));
        }
    }
);
