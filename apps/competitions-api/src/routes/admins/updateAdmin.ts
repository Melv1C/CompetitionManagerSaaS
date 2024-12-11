import { Router } from 'express';
import { prisma } from '@competition-manager/prisma';
import { parseRequest, checkRole, checkAdminRole, AuthenticatedRequest } from '@competition-manager/utils';
import { Eid$, Id$ } from '@competition-manager/schemas';
import { BaseAdmin$, AdminWithoutIdAndRelation$ } from '@competition-manager/schemas';
import { z } from 'zod';

export const router = Router();

const Params$ = z.object({
    competitionEid: Eid$,
    adminId: Id$
});

const Body$ = AdminWithoutIdAndRelation$

router.put(
    '/:competitionEid/admins/:adminId',
    parseRequest('body', Body$),
    parseRequest('params', Params$),
    checkRole('club'),
    async (req: AuthenticatedRequest, res) => {
        try{
            const { competitionEid, adminId } = Params$.parse(req.params);
            const newAdmin = Body$.parse(req.body);
            const competition = await prisma.competition.findUnique({
                where: {
                    eid: competitionEid
                },
                include: {
                    admins: true
                }
            });
            if (!competition) {
                res.status(404).send('Competition not found');
                return;
            }
            if (!checkAdminRole('owner', req.user!.id, z.array(BaseAdmin$).parse(competition.admins), res)) {
                return;
            }
            try {
                const admin = await prisma.admin.update({
                    where: {
                        id: adminId
                    },
                    data: newAdmin
                });
                res.send(admin);
            } catch (e: any) {
                if (e.code === 'P2025') {
                    res.status(404).send('Admin not found');
                } else {
                    console.error(e);
                    res.status(500).send('Internal server error');
                }
            }
        } catch (error) {
            console.error(error);
            res.status(500).send('Internal server error');
        }
    }
    
);