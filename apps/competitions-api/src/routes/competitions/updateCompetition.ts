import { Router } from 'express';
import { prisma } from '@competition-manager/prisma';
import { parseRequest, AuthenticatedRequest, checkRole, checkAdminRole } from '@competition-manager/utils';
import { UpdateCompetitionWithRelationId$, Competition$, ACCESS } from '@competition-manager/schemas';
import { BaseAdmins$ } from '@competition-manager/schemas';

export const router = Router();

const Params$ = Competition$.pick({
    eid: true,
});

router.put(
    '/:eid',
    parseRequest('body', UpdateCompetitionWithRelationId$),
    parseRequest('params', Params$),
    checkRole('admin'),
    async (req: AuthenticatedRequest, res) => {
        try {
            //si add option stripe TODO

            const { paymentPlanId, optionsId, freeClubsId, ...newCompetitionData } = UpdateCompetitionWithRelationId$.parse(req.body);
            const { eid } = Params$.parse(req.params);
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
            if (!checkAdminRole(ACCESS.COMPETITIONS, req.user!.id, BaseAdmins$.parse(competition.admins), res)) {
                return;
            }
            try {
                const updatedCompetition = await prisma.competition.update({
                    where: {
                        eid
                    },
                    data: {
                        ...newCompetitionData,
                        paymentPlan: {
                            connect: {
                                id: paymentPlanId
                            }
                        },
                        options: {
                            set: optionsId.map(id => ({ id }))
                        },
                        freeClubs: {
                            set: freeClubsId.map(id => ({ id }))
                        }
                    }
                });
                res.send(updatedCompetition);
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