import { Router } from 'express';
import { prisma } from '@competition-manager/prisma';
import { parseRequest, AuthenticatedRequest, checkRole } from '@competition-manager/utils';
import { Access, BaseCompetitionWithRelationId$, Role } from '@competition-manager/schemas';

export const router = Router();

router.post(
    '/',
    parseRequest('body', BaseCompetitionWithRelationId$),
    checkRole(Role.CLUB),
    async (req: AuthenticatedRequest, res) => {
        // TODO: stripe
        const { paymentPlanId, optionsId, ...competition } = BaseCompetitionWithRelationId$.parse(req.body);
        const newCompetition = await prisma.competition.create({
            data: {
                ...competition,
                email: req.user!.email,
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
                        access: [Access.OWNER],
                        user: {
                            connect: {
                                id: req.user!.id
                            }
                        }
                    }
                }
            }
        });
        res.send(newCompetition);
    }
);