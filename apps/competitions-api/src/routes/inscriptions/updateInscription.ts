import { Router } from 'express';
import { parseRequest, CustomRequest, checkAdminRole, checkRole, Key, catchError, logRequestMiddleware } from '@competition-manager/backend-utils';
import { UpdateInscription$, BaseAdmin$, Access, Role, competitionInclude } from '@competition-manager/schemas';
import { z } from 'zod';
import { prisma } from '@competition-manager/prisma';
import { logger } from '../../logger';
import { isAuthorized } from '@competition-manager/utils';

export const router = Router();

const Params$ = z.object({
    competitionEid: z.string(),
    inscriptionEid: z.string()
})

router.put(
    '/:competitionEid/inscriptions/:inscriptionEid',
    logRequestMiddleware(logger),
    parseRequest(Key.Params, Params$),
    parseRequest(Key.Body, UpdateInscription$),
    checkRole(Role.ADMIN),
    async (req: CustomRequest, res) => {
        try {
            const { competitionEid, inscriptionEid } = Params$.parse(req.params);
            const inscriptionData = UpdateInscription$.parse(req.body);
            const competition = await prisma.competition.findUnique({
                where: { eid: competitionEid },
                include: competitionInclude
            });
            if (!competition) {
                res.status(404).send('competitionNotFound');
                return;
            }
            if (!isAuthorized(req.user!, Role.SUPERADMIN) && !checkAdminRole(Access.INSCRIPTIONS, req.user!.id, BaseAdmin$.array().parse(competition.admins), res, req.t)) {
                return;
            }
            const {record, ...rest} = inscriptionData;
            
            const inscription = await prisma.inscription.update({
                where: { 
                    eid: inscriptionEid,
                    competitionId: competition.id
                },
                data: {
                    ...rest,
                    ...(record && { record: { update: record } })
                },
            });
            res.send(inscription);
            
        } catch (e) {
            catchError(logger)(e, {
                message: 'Internal server error',
                path: 'POST /:competitionEid/inscriptions/:inscriptionEid',
                status: 500,
                userId: req.user?.id
            });
            res.status(500).send('internalServerError');
        }
    }
);
