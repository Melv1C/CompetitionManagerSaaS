import { Router } from 'express';
import { prisma } from '@competition-manager/prisma';
import { parseRequest, AuthenticatedRequest, checkRole, Key } from '@competition-manager/utils';
import { Access, CreateCompetition$, Competition$, DefaultCompetition$, Role } from '@competition-manager/schemas';

export const router = Router();

const getClubIdFromUserId = async (UserId: number) => {
    const user = await prisma.user.findUnique({
        where: {
            id: UserId
        },
        include: {
            club: {
                select: {
                    id: true
                }
            }
        }
    });
    if (!user) {
        throw new Error("user not found");
    }
    return user.club?.id;
}

router.post(
    '/',
    parseRequest(Key.Body, CreateCompetition$),
    checkRole(Role.CLUB),
    async (req: AuthenticatedRequest, res) => {
        // TODO: stripe
        const { paymentPlanId, optionsId, ...competition } = CreateCompetition$.parse(req.body);
        const defaultCompetition = DefaultCompetition$.parse(competition);
        // Set endInscriptionDate to the day before the competition by default
        defaultCompetition.endInscriptionDate = new Date(defaultCompetition.date);
        defaultCompetition.endInscriptionDate.setDate(defaultCompetition.endInscriptionDate.getDate() - 1);
        defaultCompetition.endInscriptionDate.setHours(23, 59, 59, 999);
        const clubId = await getClubIdFromUserId(req.user!.id);
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
                },
                club: clubId ? {
                    connect: {
                        id: clubId
                    }
                } : undefined
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
                club: true
            }
        });
        res.send(Competition$.parse(newCompetition));
    }
);