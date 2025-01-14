import { Router } from 'express';
import { prisma } from '@competition-manager/prisma';
import { parseRequest, AuthenticatedRequest, checkRole, Key } from '@competition-manager/backend-utils';
import { Competition$, Role } from '@competition-manager/schemas';

export const router = Router();

const Params$ = Competition$.pick({
    eid: true,
});

router.put(
    '/restore/:eid',
    parseRequest(Key.Params, Params$),
    checkRole(Role.SUPERADMIN),
    async (req: AuthenticatedRequest, res) => {
        try {
            const { eid } = Params$.parse(req.params);
            try {
                const updatedCompetition = await prisma.competition.update({
                    where: {
                        eid
                    },
                    data: {
                        isDeleted: false
                    },
                    include: {
                        paymentPlan: true,
                        options: true,
                        admins: {
                            include: {
                                user: {
                                    include: {
                                        preferences: true
                                    }
                                }
                            }
                        },
                        events: {
                            include: {
                                categories: true,
                                event: true
                            }
                        }
                    }
                });
                res.send(Competition$.parse(updatedCompetition));
            } catch (e: any) {
                if (e.code === 'P2025') {
                    res.status(404).send('Competition not found');
                    return;
                } else {
                    console.log(e);
                    res.status(500).send('Internal server error');
                }
            }
        } catch (error) {
            console.log(error);
            res.status(500).send('Internal server error');
        }
    }
    
);