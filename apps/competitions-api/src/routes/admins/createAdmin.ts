import { Router } from 'express';
import { prisma } from '@competition-manager/prisma';
import { parseRequest, checkRole, checkAdminRole, CustomRequest, Key } from '@competition-manager/backend-utils';
import { Access, Competition$, Role } from '@competition-manager/schemas';
import { CreateAdmin$, BaseAdmin$ } from '@competition-manager/schemas';
import { t } from 'i18next';

export const router = Router();

const Params$ = Competition$.pick({
    eid: true,
});

router.post(
    '/:eid/admins',
    parseRequest(Key.Body, CreateAdmin$),
    parseRequest(Key.Params, Params$),
    checkRole(Role.CLUB),
    async (req: CustomRequest, res) => {
        try{
            const { eid } = Params$.parse(req.params);
            const newAdmin = CreateAdmin$.parse(req.body);
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
            if (!checkAdminRole(Access.OWNER, req.user!.id, BaseAdmin$.array().parse(competition.admins), res, req.t)) {
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
                } else{
                    res.status(500).send(t('error.internalServerError'));
                    return;
                }
            }
        } catch (error) {
            console.error(error);
            res.status(500).send(t('error.internalServerError'));
        }
    }
    
);