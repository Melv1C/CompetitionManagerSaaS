import { Router } from 'express';
import { prisma } from '@competition-manager/prisma';
import { parseRequest, AuthenticatedRequest, checkRole, checkAdminRole, Key } from '@competition-manager/backend-utils';
import { UpdateCompetition$, Competition$, Access, Role } from '@competition-manager/schemas';
import { BaseAdmin$ } from '@competition-manager/schemas';

export const router = Router();

const Params$ = Competition$.pick({
    eid: true,
});

router.put(
    '/:eid',
    parseRequest(Key.Body, UpdateCompetition$),
    parseRequest(Key.Params, Params$),
    checkRole(Role.ADMIN),
    async (req: AuthenticatedRequest, res) => {
        try {
            //si add option stripe TODO

            const { optionsId, freeClubsId, ...newCompetitionData } = UpdateCompetition$.parse(req.body);
            const { eid } = Params$.parse(req.params);
            const competition = await prisma.competition.findUnique({
                where: {
                    eid
                },
                select: {
                    admins: true
                }
            });
            if (!competition) {
                res.status(404).send('Competition not found');
                return;
            }
            if (req.user!.role !== Role.SUPERADMIN && !checkAdminRole(Access.COMPETITIONS, req.user!.id, BaseAdmin$.array().parse(competition.admins), res)) return;
            try {
                const updatedCompetition = await prisma.competition.update({
                    where: {
                        eid
                    },
                    data: {
                        ...newCompetitionData,
                        options: {
                            set: optionsId.map(id => ({ id }))
                        },
                        freeClubs: {
                            set: freeClubsId.map(id => ({ id }))
                        }
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
                    res.status(404).send('Wrong payment plan id or option id or club id');
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