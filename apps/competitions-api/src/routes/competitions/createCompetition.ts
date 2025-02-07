import { Router } from 'express';
import { prisma } from '@competition-manager/prisma';
import { parseRequest, AuthentificatedRequest, checkRole, Key } from '@competition-manager/backend-utils';
import { Access, CreateCompetition$, Competition$, DefaultCompetition$, Role } from '@competition-manager/schemas';

export const router = Router();

const getClub = async (UserId: number) => {
    const user = await prisma.user.findUnique({
        where: {
            id: UserId
        },
        include: {
            club: {
                select: {
                    id: true,
                    address: true,
                }
            }
        }
    });
    if (!user) {
        throw new Error("user not found");
    }
    return user.club;
}

router.post(
    '/',
    parseRequest(Key.Body, CreateCompetition$),
    checkRole(Role.CLUB),
    async (req: AuthentificatedRequest, res) => {
        try {
            // TODO: stripe
            const { paymentPlanId, optionsId, ...competition } = CreateCompetition$.parse(req.body);
            const defaultCompetition = DefaultCompetition$.parse(competition);
            // Set endInscriptionDate to the day before the competition by default
            defaultCompetition.endInscriptionDate = new Date(defaultCompetition.date);
            defaultCompetition.endInscriptionDate.setDate(defaultCompetition.endInscriptionDate.getDate() - 1);
            defaultCompetition.endInscriptionDate.setHours(23, 59, 59, 999);
            const club = await getClub(req.user!.id);
            try {
                const newCompetition = await prisma.competition.create({
                    data: {
                        ...defaultCompetition,
                        email: req.user!.email,
                        location: club?.address,
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
                        club: club ? {
                            connect: {
                                id: club.id
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
            } catch (e:any) {
                if (e.code === 'P2025') {
                    res.status(400).send('Wrong payment plan id or option id');
                    return;
                }
                console.log(e);
                res.status(500).send('internalServerError');
            }
        } catch (error) {
            console.log(error);
            res.status(500).send('internalServerError');
        }
    }
);