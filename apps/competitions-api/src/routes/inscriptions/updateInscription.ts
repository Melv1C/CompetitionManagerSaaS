import {
    CustomRequest,
    Key,
    catchError,
    checkAdminRole,
    checkRole,
    logRequestMiddleware,
    parseRequest,
} from '@competition-manager/backend-utils';
import { prisma } from '@competition-manager/prisma';
import {
    Access,
    BaseAdmin$,
    Inscription$,
    Role,
    UpdateInscription$,
    competitionInclude,
    inscriptionsInclude,
} from '@competition-manager/schemas';
import { isAuthorized } from '@competition-manager/utils';
import { Router } from 'express';
import { z } from 'zod';
import { logger } from '../../logger';

export const router = Router();

const Params$ = z.object({
    competitionEid: z.string(),
    inscriptionEid: z.string(),
});

router.put(
    '/:competitionEid/inscriptions/:inscriptionEid',
    logRequestMiddleware(logger),
    parseRequest(Key.Params, Params$),
    parseRequest(Key.Body, UpdateInscription$),
    checkRole(Role.ADMIN),
    async (req: CustomRequest, res) => {
        try {
            const { competitionEid, inscriptionEid } = Params$.parse(
                req.params
            );
            const { record, ...rest } = UpdateInscription$.parse(req.body);
            const competition = await prisma.competition.findUnique({
                where: { eid: competitionEid },
                include: competitionInclude,
            });
            if (!competition) {
                res.status(404).send('errors.competitionNotFound');
                return;
            }
            if (
                !isAuthorized(req.user!, Role.SUPERADMIN) &&
                !checkAdminRole(
                    Access.INSCRIPTIONS,
                    req.user!.id,
                    BaseAdmin$.array().parse(competition.admins),
                    res,
                    req.t
                )
            ) {
                return;
            }

            const inscription = await prisma.inscription.update({
                where: {
                    eid: inscriptionEid,
                    competitionId: competition.id,
                },
                data: {
                    ...rest,
                    record: record
                        ? { upsert: { update: record, create: record } }
                        : undefined,
                },
                include: inscriptionsInclude,
            });
            res.send(Inscription$.parse(inscription));
        } catch (e) {
            catchError(logger)(e, {
                message: 'Internal server error',
                path: 'POST /:competitionEid/inscriptions/:inscriptionEid',
                status: 500,
                userId: req.user?.id,
            });
            res.status(500).send('errors.internalServerError');
        }
    }
);
