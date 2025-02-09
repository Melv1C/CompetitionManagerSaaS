import { Router } from 'express';
import { Prisma, prisma } from '@competition-manager/prisma';
import { parseRequest, Key, checkRole, catchError, AuthentificatedRequest } from '@competition-manager/backend-utils';
import { Role, User$, UpdateUser$ } from '@competition-manager/schemas';
import { logger } from '../logger';

export const router = Router();

const Params$ = User$.pick({
    id: true,
});

router.post(
    '/:id',
    parseRequest(Key.Body, UpdateUser$),
    parseRequest(Key.Params, Params$),
    checkRole(Role.SUPERADMIN),
    async (req: AuthentificatedRequest, res) => {
        try {
            const { clubId, role } = UpdateUser$.parse(req.body);
            const { id } = Params$.parse(req.params);
            try {
                const user = await prisma.user.update({
                    where: {
                        id: id
                    },
                    data: {
                        role: role,
                        club: clubId ? {
                            connect: {
                                id: clubId
                            } 
                        } : undefined 
                    },
                    include: {
                        club: true,
                        preferences: true
                    }
                });
                res.send(User$.parse(user));
            } catch (e) {
                if (e instanceof Prisma.PrismaClientKnownRequestError && e.code === 'P2025') {
                    catchError(logger)(e, {
                        message: 'User or club not found',
                        path: 'POST /:id',
                        status: 404,
                        userId: req.user?.id,
                        metadata: {
                            updateUserId: id,
                            clubId,
                            role
                        }
                    });

                    res.status(404).send(req.t('errors.userOrClubNotFound'));
                    return;
                }
                throw e;
            }
        } catch (error) {
            catchError(logger)(error, {
                message: "Internal server error",
                path: "POST /:id",
                status: 500,
                userId: req.user?.id
            });
            res.status(500).send(req.t('errors.internalServerError'));
        }
    }
);