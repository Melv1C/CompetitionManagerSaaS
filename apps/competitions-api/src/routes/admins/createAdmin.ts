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
    Competition$,
    CreateAdmin$,
    Role,
} from '@competition-manager/schemas';
import { isAuthorized } from '@competition-manager/utils';
import { Router } from 'express';

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
        try {
            const { eid } = Params$.parse(req.params);
            const newAdmin = CreateAdmin$.parse(req.body);
            const competition = await prisma.competition.findUnique({
                where: {
                    eid,
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
                    Access.OWNER,
                    req.user!.id,
                    BaseAdmin$.array().parse(competition.admins),
                    res,
                    req.t
                )
            ) {
                return;
            }
            try {
                // Find user by email
                const user = await prisma.user.findUnique({
                    where: {
                        email: newAdmin.email,
                    },
                });

                if (!user) {
                    res.status(404).send('User not found');
                    return;
                }

                const admin = await prisma.admin.create({
                    data: {
                        access: newAdmin.access,
                        competition: {
                            connect: {
                                eid,
                            },
                        },
                        user: {
                            connect: {
                                id: user.id,
                            },
                        },
                    },
                });
                res.send(admin);
            } catch (e: any) {
                if (e.code === 'P2025') {
                    res.status(404).send('User not found');
                    return;
                } else {
                    res.status(500).send(req.t('error.internalServerError'));
                    return;
                }
            }
        } catch (error) {
            console.error(error);
            res.status(500).send(req.t('error.internalServerError'));
        }
    }
);
