import { Router } from 'express';
import { Prisma, prisma } from '@competition-manager/prisma';
import { parseRequest, CustomRequest, checkRole, Key, catchError } from '@competition-manager/backend-utils';
import { Competition$, competitionInclude, Role } from '@competition-manager/schemas';
import { logger } from '../../logger';

export const router = Router();

const Params$ = Competition$.pick({
    eid: true,
});

router.put(
    '/:eid/restore',
    parseRequest(Key.Params, Params$),
    checkRole(Role.SUPERADMIN),
    async (req: CustomRequest, res) => {
        try {
            const { eid } = Params$.parse(req.params);
            try {
                const updatedCompetition = await prisma.competition.update({
                    where: {
                        eid
                    },
                    data: {
                        isDeleted: false
                    },
                    include: competitionInclude
                });
                logger.info('Competition restored', {
                    path: 'PUT /:eid/restore',
                    userId: req.user?.id,
                    status: 200,
                    metadata: {
                        id: updatedCompetition.id,
                        eid: updatedCompetition.eid,
                        name: updatedCompetition.name
                    }
                });
                res.send(Competition$.parse(updatedCompetition));
            } catch (e) {
                if (e instanceof Prisma.PrismaClientKnownRequestError) {
                    catchError(logger)(e, {
                        message: 'Prisma error',
                        path: 'PUT /:eid/restore',
                        userId: req.user?.id,
                        status: 400,
                    });
                    res.status(404).send(req.t('errors.badRequest'));
                    return;
                } 
                throw e;
            }
        } catch (error) {
            catchError(logger)(error, {
                message: 'Internal server error',
                path: 'PUT /:eid/restore',
                userId: req.user?.id,
                status: 500,
            });
            res.status(500).send(req.t('errors.internalServerError'));
        }
    }
    
);