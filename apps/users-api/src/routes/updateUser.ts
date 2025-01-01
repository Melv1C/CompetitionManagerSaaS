import { Router } from 'express';
import { prisma } from '@competition-manager/prisma';
import { parseRequest, Key, checkRole } from '@competition-manager/utils';
import { Id$, Role, User$ } from '@competition-manager/schemas';

export const router = Router();

const Params$ = User$.pick({
    id: true,
});

const Body$ = User$.pick({ 
    email: true,
    role: true,
}).extend({
    clubId: Id$.nullish(),
});

router.post(
    '/:id',
    parseRequest(Key.Body, Body$),
    parseRequest(Key.Params, Params$),
    checkRole(Role.SUPERADMIN),
    async (req, res) => {
        try {
            const { email, clubId, role } = Body$.parse(req.body);
            try {
                const user = await prisma.user.update({
                    where: {
                        email: email
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
                res.status(500).send("Internal server error");
                return;
            }
        } catch (error) {
            console.error(error);
            res.status(500).send
        }
    }
);