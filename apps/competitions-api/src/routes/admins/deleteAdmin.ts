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
    Role,
    UpdateAdmin$,
} from '@competition-manager/schemas';
import { isAuthorized } from '@competition-manager/utils';
import { router } from './createAdmin';

router.delete(
    '/:competitionEid/admins/:adminId',
    parseRequest(Key.Body, UpdateAdmin$),
    checkRole(Role.ADMIN),
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
