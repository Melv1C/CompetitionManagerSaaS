import { Router } from 'express';
import { prisma } from '@competition-manager/prisma';
import { parseRequest, AuthenticatedRequest, checkRole, checkAdminRole } from '@competition-manager/utils';
import { UpdateCompetition$, UpdateCompetitionWithRelationId$, Competition$ } from '@competition-manager/schemas';
import { BaseAdmin$ } from '@competition-manager/schemas';
import { z } from 'zod';

export const router = Router();

const Params$ = Competition$.pick({
    eid: true,
});

const Body$ = UpdateCompetitionWithRelationId$;

router.put(
    '/:eid',
    parseRequest('body', Body$),
    parseRequest('params', Params$),
    checkRole('admin'),
    async (req: AuthenticatedRequest, res) => {
        try {
            //si add option stripe a faire


            const body = Body$.parse(req.body);
            const newCompetitionData = UpdateCompetition$.parse(body);
            const { paymentPlanId, optionsId, freeClubsId } = body;
            const eid = Params$.parse(req.params).eid;
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
            if (!checkAdminRole('competitions', req.user!.id, z.array(BaseAdmin$).parse(competition.admins), res)) {
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
                            connect: optionsId?.map(id => ({ id }))
                        },
                        freeClubs: {
                            connect: freeClubsId?.map(id => ({ id }))
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
                    res.status(500).send(e.message);
                }
            }
        } catch (error) {
            console.log(error);
            res.status(500).send('Internal server error');
        }
    }
    
);