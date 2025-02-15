import { Router } from 'express';
import { Prisma, prisma } from '@competition-manager/prisma';
import { parseRequest, CustomRequest, checkRole, Key, catchError } from '@competition-manager/backend-utils';
import { Access, CreateCompetition$, Competition$, DefaultCompetition$, Role } from '@competition-manager/schemas';
import { logger } from '../../logger';

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
    async (req: CustomRequest, res) => {
        try {
            // TODO: stripe
            const { paymentPlanId, optionsId, ...competition } = CreateCompetition$.parse(req.body);
            const defaultCompetition = DefaultCompetition$.parse(competition);
            defaultCompetition.startInscriptionDate = new Date();
            // Set endInscriptionDate to the day before the competition by default
            defaultCompetition.endInscriptionDate = new Date(defaultCompetition.date);
            defaultCompetition.endInscriptionDate.setUTCDate(defaultCompetition.endInscriptionDate.getDate() - 1);
            defaultCompetition.endInscriptionDate.setUTCHours(23, 59, 59);
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

                logger.info(`Competition created`, {
                    path: 'POST /',
                    userId: req.user?.id,
                    status: 201,
                    metadata: competition
                });

                res.send(Competition$.parse(newCompetition));
            } catch (e) {
                if (e instanceof Prisma.PrismaClientKnownRequestError) {
                    catchError(logger)(e, {
                        message: 'Error while creating competition',
                        path: 'POST /',
                        userId: req.user?.id,
                        status: 500,
                    });
                    res.status(500).send(req.t('errors.competitionCreationError'));
                    return;
                }
                throw e;
            }
        } catch (error) {
            catchError(logger)(error, {
                message: 'Internal server error',
                path: 'POST /',
                userId: req.user?.id,
                status: 500,
            });
            res.status(500).send(req.t('errors.internalServerError'));
        }
    }
);