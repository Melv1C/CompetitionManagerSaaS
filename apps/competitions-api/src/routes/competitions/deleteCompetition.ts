import { Router } from 'express';
import { prisma } from '@competition-manager/prisma';
import { z } from 'zod';
import { parseRequest, checkRole, checkAdminRole, AuthenticatedRequest, Key } from '@competition-manager/utils';
import { Access, BaseAdmin$, Eid$, Role } from '@competition-manager/schemas';

export const router = Router();

const Params$ = z.object({
    competitionEid: Eid$
});

router.delete(
    '/:competitionEid',
    parseRequest(Key.Params, Params$),
    checkRole(Role.CLUB),
    async (req: AuthenticatedRequest, res) => {
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
                res.status(404).send('Competition not found');
                return;
            }
            if (req.user!.role != Role.SUPERADMIN && !checkAdminRole(Access.OWNER, req.user!.id, z.array(BaseAdmin$).parse(competition.admins), res)) {
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
            res.send('Competition deleted');
            
        } catch (e) {
            console.error(e);
            res.status(500).send('Internal server error');
        }
    }
);
