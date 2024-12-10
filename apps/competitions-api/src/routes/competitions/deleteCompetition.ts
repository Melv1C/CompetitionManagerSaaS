import { Router } from 'express';
import { prisma } from '@competition-manager/prisma';
import { z } from 'zod';
import { parseRequest, checkRole, checkAdminRole, AuthenticatedRequest } from '@competition-manager/utils';
import { BaseAdmin$, Eid$ } from '@competition-manager/schemas';

export const router = Router();

const Params$ = z.object({
    competitionEid: Eid$
});

router.delete(
    '/:competitionEid',
    parseRequest('params', Params$),
    checkRole('admin'),
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
            if (!checkAdminRole('owner', req.user!.id, z.array(BaseAdmin$).parse(competition.admins), res)) {
                return;
            }
            await prisma.competition.delete({
                where: {
                    eid: competitionEid
                }
            });
            res.send('Competition deleted');
            
        } catch (e) {
            console.error(e);
            res.status(500).send('Internal server error');
        }
    }
);
