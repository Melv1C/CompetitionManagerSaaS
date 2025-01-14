import { Router } from 'express';
import { prisma } from '@competition-manager/prisma';
import { parseRequest, checkRole, checkAdminRole, AuthenticatedRequest, Key } from '@competition-manager/backend-utils';
import { Access, Eid$, Id$, Role } from '@competition-manager/schemas';
import { BaseAdmin$, UpdateAdmin$ } from '@competition-manager/schemas';
import { z } from 'zod';

export const router = Router();

const Params$ = z.object({
    competitionEid: Eid$,
    adminId: Id$
});


router.put(
    '/:competitionEid/admins/:adminId',
    parseRequest(Key.Body, UpdateAdmin$),
    parseRequest(Key.Params, Params$),
    checkRole(Role.CLUB),
    async (req: AuthenticatedRequest, res) => {
        try{
            const { competitionEid, adminId } = Params$.parse(req.params);
            const newAdmin = UpdateAdmin$.parse(req.body);
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
            if (!checkAdminRole(Access.OWNER, req.user!.id, BaseAdmin$.array().parse(competition.admins), res)) {
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