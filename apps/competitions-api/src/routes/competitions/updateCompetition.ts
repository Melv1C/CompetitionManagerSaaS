import { Router } from 'express';
import { Prisma, prisma } from '@competition-manager/prisma';
import { parseRequest, CustomRequest, checkRole, checkAdminRole, Key, catchError } from '@competition-manager/backend-utils';
import { UpdateCompetition$, Competition$, Access, Role } from '@competition-manager/schemas';
import { BaseAdmin$ } from '@competition-manager/schemas';
import { competitionInclude } from '../../utils';
import { logger } from '../../logger';

export const router = Router();

const Params$ = Competition$.pick({
    eid: true,
});

router.put(
    '/:eid',
    parseRequest(Key.Body, UpdateCompetition$),
    parseRequest(Key.Params, Params$),
    checkRole(Role.ADMIN),
    async (req: CustomRequest, res) => {
        try {
            //si add option stripe TODO

            const { optionsId, freeClubsId, allowedClubsId, ...newCompetitionData } = UpdateCompetition$.parse(req.body);
            const { eid } = Params$.parse(req.params);
            const competition = await prisma.competition.findUnique({
                where: {
                    eid
                },
                select: {
                    admins: true
                }
            });
            if (!competition) {
                res.status(404).send('Competition not found');
                return;
            }
            if (req.user!.role !== Role.SUPERADMIN && !checkAdminRole(Access.COMPETITIONS, req.user!.id, BaseAdmin$.array().parse(competition.admins), res, req.t)) return;
            try {
                const updatedCompetition = await prisma.competition.update({
                    where: {
                        eid
                    },
                    data: {
                        ...newCompetitionData,
                        options: {
                            set: optionsId.map(id => ({ id }))
                        },
                        freeClubs: {
                            set: freeClubsId.map(id => ({ id }))
                        },
                        allowedClubs: {
                            set: allowedClubsId.map(id => ({ id }))
                        }
                    },
                    include: competitionInclude
                });
                res.send(Competition$.parse(updatedCompetition));
            } catch (e) {
                if (e instanceof Prisma.PrismaClientKnownRequestError) {
                    catchError(logger)(e, {
                        message: 'Prisma error',
                        path: 'PUT /:eid',
                        userId: req.user?.id,
                        status: 400,
                    });
                    res.status(400).send(req.t('errors.badRequest'));
                    return;
                }
                throw e;
            }
        } catch (error) {
            catchError(logger)(error, {
                message: 'Internal server error',
                path: 'PUT /:eid',
                userId: req.user?.id,
                status: 500,
            });
            res.status(500).send(req.t('errors.internalServerError'));
        }
    }
    
);