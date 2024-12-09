import { Router } from 'express';
import { prisma } from '@competition-manager/prisma';
import { parseRequest, checkRole, checkAdminRole, AuthenticatedRequest } from '@competition-manager/utils';
import { Competition$ } from '@competition-manager/schemas';
import { Admin$ } from '@competition-manager/schemas';
import { z } from 'zod';

export const router = Router();

const Params$ = Competition$.pick({
    eid: true,
});

const Body$ = Admin$.pick({
    userId: true,
    access: true
});

router.post(
    '/:eid/admins',
    parseRequest('body', Body$),
    parseRequest('params', Params$),
    checkRole('club'),
    async (req: AuthenticatedRequest, res) => {
        try{
            const { eid } = Params$.parse(req.params);
            const newAdmin = Body$.parse(req.body);
            const competition = await prisma.competition.findUnique({
                where: {
                    eid
                },
                include: {
                    admins: true
                }
            });
            if (!competition) {
                res.status(404).send('Competition not found');
                return;
            }
            if (!checkAdminRole('owner', req.user!.id, z.array(Admin$).parse(competition.admins), res)) {
                return;
            }
            try{
                const admin = await prisma.admin.create({
                    data: {
                        access: newAdmin.access,
                        competition: {
                            connect: {
                                eid
                            }
                        },
                        user: {
                            connect: {
                                id: newAdmin.userId
                            }
                        }
                    }
                });
                res.send(admin);
            } catch (e: any) {
                if (e.code === 'P2025') {
                    res.status(404).send('User not found');
                    return;
                }else{
                    res.status(500).send('Internal server error');
                    return;
                }
            }
        } catch {
            res.status(500).send('Internal server error');
        }
    }
    
);