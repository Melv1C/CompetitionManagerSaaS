import {
    checkAdminRole,
    checkRole,
    CustomRequest,
    Key,
    parseRequest,
} from '@competition-manager/backend-utils';
import { prisma } from '@competition-manager/prisma';
import {
    Access,
    BaseAdmin$,
    Eid$,
    Id$,
    Role,
} from '@competition-manager/schemas';
import { isAuthorized } from '@competition-manager/utils';
import { Router } from 'express';
import { z } from 'zod';

export const router = Router();

const Params$ = z.object({
    competitionEid: Eid$,
    adminId: Id$,
});

router.delete(
    '/:competitionEid/admins/:adminId',
    checkRole(Role.ADMIN),
    parseRequest(Key.Params, Params$),
    async (req: CustomRequest, res) => {
        try {
            const { competitionEid, adminId } = req.params;
            const competition = await prisma.competition.findUnique({
                where: {
                    eid: competitionEid,
                },
                include: {
                    admins: true,
                },
            });
            if (!competition) {
                res.status(404).send('Competition not found');
                return;
            }
            if (
                !isAuthorized(req.user!, Role.SUPERADMIN) &&
                !checkAdminRole(
                    Access.COMPETITIONS,
                    req.user!.id,
                    BaseAdmin$.array().parse(competition.admins),
                    res,
                    req.t
                )
            ) {
                return;
            }
            await prisma.admin.delete({
                where: {
                    id: Number(adminId),
                },
            });
            res.status(200).send('Admin deleted successfully');
        } catch (error) {
            res.status(500).send('Internal server error');
        }
    }
);
