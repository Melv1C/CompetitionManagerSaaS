import { Router } from 'express';
import { prisma } from '@competition-manager/prisma';
import { parseRequest, AuthenticatedRequest, checkRole, Key } from '@competition-manager/utils';
import { Access, BaseCompetitionWithRelationId$, Competition$, DefaultCompetition$, Role } from '@competition-manager/schemas';

export const router = Router();

router.post(
    '/',
    parseRequest(Key.Body, BaseCompetitionWithRelationId$),
    checkRole(Role.CLUB),
    async (req: AuthenticatedRequest, res) => {
        // TODO: stripe
        const { paymentPlanId, optionsId, ...competition } = BaseCompetitionWithRelationId$.parse(req.body);
        const defaultCompetition = DefaultCompetition$.parse(competition);
        const newCompetition = await prisma.competition.create({
            data: {
                ...defaultCompetition,
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
                }
            }
        });
        res.send(Competition$.parse(newCompetition));
    }
);