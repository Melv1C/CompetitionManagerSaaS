import { Router } from 'express';
import { prisma } from '@competition-manager/prisma';
import { parseRequest, Key, checkRole, catchError } from '@competition-manager/backend-utils';
import { Role, User$, UpdateUser$ } from '@competition-manager/schemas';
import { logger } from '..';

export const router = Router();

const Params$ = User$.pick({
    id: true,
});

router.post(
    '/:id',
    parseRequest(Key.Body, UpdateUser$),
    parseRequest(Key.Params, Params$),
    checkRole(Role.SUPERADMIN),
    async (req, res) => {
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
            } catch (e: any) {
                if (e.code === 'P2025') {
                    res.status(404).send("user or club not found");
                    return;
                }
                catchError(logger)(e, {
                    message: "Internal server error",
                    path: "POST /:id",
                    status: 500
                });
                res.status(500).send("Internal server error");
                return;
            }
        } catch (error) {
            catchError(logger)(error, {
                message: "Internal server error",
                path: "POST /:id",
                status: 500
            });
            res.status(500).send
        }
    }
);