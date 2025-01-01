import { Router } from 'express';
import { prisma } from '@competition-manager/prisma';
import { parseRequest, Key, checkRole } from '@competition-manager/utils';
import { Id$, Role, User$ } from '@competition-manager/schemas';

export const router = Router();

const Body$ = User$.pick({ 
    email: true,
}).extend({
    clubId: Id$,
});

router.post(
    '/club',
    parseRequest(Key.Body, Body$),
    checkRole(Role.SUPERADMIN),
    async (req, res) => {
        try {
            const { email, clubId } = Body$.parse(req.body);
            try {
                await prisma.user.update({
                    where: {
                        email: email
                    },
                    data: {
                        role: Role.CLUB,
                        club: {
                            connect: {
                                id: clubId
                            }
                        }
                    }
                });
                res.send("User club set");
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