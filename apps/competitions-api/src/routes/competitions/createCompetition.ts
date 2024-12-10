import { Router } from 'express';
import { prisma } from '@competition-manager/prisma';
import { parseRequest, AuthenticatedRequest, checkRole } from '@competition-manager/utils';
import { BaseCompetitionWithRelationId$ ,BaseCompetition$ } from '@competition-manager/schemas';

export const router = Router();

const Body$ = BaseCompetitionWithRelationId$;

router.post(
    '/',
    parseRequest('body', Body$),
    checkRole('club'),
    async (req: AuthenticatedRequest, res) => {
        // TODO: stripe


        const body = Body$.parse(req.body);
        const competition = BaseCompetition$.parse(body);
        const { paymentPlanId, optionsId } = body;
        const user = req.user;
        const newCompetition = await prisma.competition.create({
            data: {
                ...competition,
                email: user!.email,
                paymentPlan: {
                    connect: {
                        id: paymentPlanId
                    }
                },
                options: {
                    connect: optionsId?.map(id => ({ id }))
                },
                admins: {
                    create: {
                        access: ['owner'],
                        user: {
                            connect: {
                                id: user!.id
                            }
                        }
                    }
                }
            }
        });
        res.send(newCompetition);
    }
);