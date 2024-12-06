import { Router } from 'express';
import { prisma } from '@competition-manager/prisma';
import { parseRequest, authMiddleware, adminAuthMiddleware, AuthenticatedRequest } from '@competition-manager/utils';
import { Competition$ } from '@competition-manager/schemas';
import { Admin$ } from '@competition-manager/schemas';

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
    authMiddleware('club'),
    adminAuthMiddleware('owner'),
    async (req: AuthenticatedRequest, res) => {
        const { eid } = Params$.parse(req.params);
        const newAdmin = Body$.parse(req.body);
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
    }
    
);