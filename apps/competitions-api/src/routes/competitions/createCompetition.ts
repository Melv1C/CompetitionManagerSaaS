import { Router } from 'express';
import { prisma } from '@competition-manager/prisma';
import { parseRequest, AuthenticatedRequest, checkRole } from '@competition-manager/utils';
import { BaseCompetitionWithRelationId$ ,BaseCompetition$ } from '@competition-manager/schemas';

export const router = Router();

router.post(
    '/',
    parseRequest('body', BaseCompetitionWithRelationId$),
    checkRole('club'),
    async (req: AuthenticatedRequest, res) => {
        // TODO: stripe

        const { paymentPlanId, optionsId, ...competitionData } = BaseCompetitionWithRelationId$.parse(req.body);
        const competition = BaseCompetition$.parse(competitionData );
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