import { Router } from 'express';
import { parseRequest, CustomRequest, checkAdminRole, checkRole, Key, saveInscriptions, findAthleteWithLicense, catchError, logRequestMiddleware, sendEmailInscription } from '@competition-manager/backend-utils';
import { Competition$, CreateInscription$, BaseAdmin$, Athlete$, Access, Role, Inscription$, AdminQuery$, InscriptionStatus, Eid, WebhookType, competitionInclude, inscriptionsInclude, athleteInclude } from '@competition-manager/schemas';
import { z } from 'zod';
import { prisma, Prisma } from '@competition-manager/prisma';
import { createCheckoutSession } from '@competition-manager/stripe';
import { getCategoryAbbr, getCostsInfo, isAuthorized } from '@competition-manager/utils';
import { logger } from '../../logger';
import { env } from '../../env';

export const router = Router();

const Params$ = Competition$.pick({
    eid: true
});

router.post(
    '/:eid/inscriptions',
    logRequestMiddleware(logger),
    parseRequest(Key.Params, Params$),
    parseRequest(Key.Body, CreateInscription$.array()),
    parseRequest(Key.Query, AdminQuery$),
    checkRole(Role.USER),
    async (req: CustomRequest, res) => {
        try {
            const { isAdmin } = AdminQuery$.parse(req.query);
            const { eid } = Params$.parse(req.params);
            const inscriptionsData = CreateInscription$.array().parse(req.body);
            if (inscriptionsData.length === 0) {
                logger.warn('No inscriptions provided', {
                    path: 'POST /:eid/inscriptions',
                    status: 400,
                    userId: req.user?.id,
                    metadata: req.body
                });
                res.status(400).send('No inscriptions provided');
                return;
            }

            if (isAdmin && (!req.user || !isAuthorized(req.user, Role.ADMIN))) {
                res.status(401).send('Unauthorized');
                return;
            }

            if (isAdmin && !isAuthorized(req.user!, Role.SUPERADMIN)) {
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
                if (!checkAdminRole(Access.INSCRIPTIONS, req.user!.id, BaseAdmin$.array().parse(competition.admins), res, req.t)) return;
            }

            const competition = await prisma.competition.findUnique({
                where: {
                    eid
                },
                include: {
                    ...competitionInclude,
                    oneDayAthletes: {
                        include: athleteInclude
                    },
                    inscriptions: {
                        include: inscriptionsInclude
                    }
                }
            });

            if (!competition) {
                logger.warn('Competition not found', {
                    path: 'POST /:eid/inscriptions',
                    status: 404,
                    userId: req.user?.id,
                    metadata: {
                        competitionEid: eid
                    }
                });
                res.status(404).send('Competition not found');
                return;
            }

            const parsedCompetition = Competition$.parse(competition);

            // Check if inscriptions are open for the competition
            if (!isAdmin && (parsedCompetition.startInscriptionDate > new Date() || parsedCompetition.endInscriptionDate < new Date())) {
                res.status(400).send('Inscriptions are closed');
                return;
            }

            for (const athInscriptions of inscriptionsData) {
                try {
                    // Check if athlete exists
                    const athlete = await findAthleteWithLicense(athInscriptions.athleteLicense, z.array(Athlete$).parse(competition.oneDayAthletes));
                    const cat = getCategoryAbbr(athlete.birthdate, athlete.gender, parsedCompetition.date);

                    // Check if the athlete club is allowed to inscribe
                    if (!isAdmin && parsedCompetition.allowedClubs.length > 0 && !parsedCompetition.allowedClubs.map((c) => c.id).includes(athlete.club.id)) {
                        res.status(400).send('Club ' + athlete.club.abbr + ' is not allowed to inscribe in this competition');
                        return;
                    }

                    // Check if athlete isn't inscribed in too many events
                    if (!isAdmin && parsedCompetition.maxEventByAthlete && athInscriptions.inscriptions.length > parsedCompetition.maxEventByAthlete) {
                        res.status(400).send('Athlete ' + athInscriptions.athleteLicense + ' is inscribed in too many events');
                        return;
                    }

                    for (const inscription of athInscriptions.inscriptions) {
                        // Check if event exists
                        const event = parsedCompetition.events.find((e) => e.eid === inscription.competitionEventEid);
                        if (!event) {
                            res.status(404).send('Event ' + inscription.competitionEventEid + ' not found');
                            return;
                        }
                        // Check if athlete is in the right category
                        if (!event.categories.some((c) => c.abbr === cat)) {
                            res.status(400).send('Athlete ' + athInscriptions.athleteLicense + ' is not in the right category for event ' + inscription.competitionEventEid + ' (' + cat + ')');
                            return;
                        }
                        // Check if inscriptions are open for the event
                        if (!isAdmin && !event.isInscriptionOpen) {
                            res.status(400).send('Inscriptions for event ' + inscription.competitionEventEid + ' are closed');
                            return;
                        }

                        const nbParticipants = competition.inscriptions.filter((i) => 
                            i.isDeleted === false 
                            && i.status === InscriptionStatus.ACCEPTED 
                            && i.competitionEventId === event.id
                            && i.athlete.license !== athInscriptions.athleteLicense // Don't count the current athlete
                        ).length;
                        // Check if event is full
                        if (!isAdmin && event.place && nbParticipants >= event.place) {
                            res.status(400).send('Event ' + inscription.competitionEventEid + ' is full');
                            return;
                        }
                    }
                } catch (e) {
                    if (e instanceof Prisma.PrismaClientKnownRequestError && e.code === 'P2025') {
                        res.status(404).send('Athlete not found');
                        return;
                    }
                    // Rethrow the error if it's not a known error
                    throw e;
                }
            }

            // Get the cumulated costs for all inscriptions
            const { alreadyPaid, fees, totalToPay, totalCost } = (await Promise.all(inscriptionsData.map(async ({ athleteLicense, inscriptions }) => {
                const athlete = await findAthleteWithLicense(athleteLicense, z.array(Athlete$).parse(competition.oneDayAthletes));
                return getCostsInfo(parsedCompetition, athlete, inscriptions.map((i) => i.competitionEventEid), Inscription$.array().parse(competition.inscriptions).filter((i) => i.user.id === req.user!.id));
            }))).reduce((acc, { totalCost, alreadyPaid, fees, totalToPay }) => {
                acc.totalCost += totalCost;
                acc.alreadyPaid += alreadyPaid;
                acc.fees += fees;
                acc.totalToPay += totalToPay;
                return acc;
            }, { totalCost: 0, alreadyPaid: 0, fees: 0, totalToPay: 0 });

            if (isAdmin) {
                const inscriptions = await saveInscriptions(
                    eid, 
                    await Promise.all(inscriptionsData.map(async ({ athleteLicense, inscriptions }) => {
                        const athlete = await findAthleteWithLicense(athleteLicense, z.array(Athlete$).parse(competition.oneDayAthletes));
                        const userId = competition.inscriptions.find((i) => i.athlete.license === athlete.license)?.user.id || req.user!.id;
                        return {
                            userId,
                            athlete,
                            inscriptions: inscriptions.map((data) => {
                                return {
                                    data,
                                    meta: {
                                        status: InscriptionStatus.ACCEPTED
                                    },
                                };
                            })
                        };
                    })),
                    Inscription$.array().parse(competition.inscriptions),
                    alreadyPaid,
                    parsedCompetition.events
                );
                res.send([...inscriptions.createdInscriptions, ...inscriptions.updatedInscriptions]);
                return;
            }
            
            const nbOfInscriptionsByEvent = inscriptionsData.reduce((acc, { inscriptions }) => {
                inscriptions.forEach(({ competitionEventEid }) => {
                    acc[competitionEventEid] = (acc[competitionEventEid] || 0) + 1;
                });
                return acc;
            }, {} as Record<Eid, number>);

            if (totalToPay > 0) {
                try {
                    const inscriptions = inscriptionsData.map(({ athleteLicense, inscriptions }) => {
                        return inscriptions.map((data) => {
                            return {
                                athlete: athleteLicense,
                                event: data.competitionEventEid,
                                record: data.record
                            };
                        });
                    }).flat();

                    const lineItems = [...Object.entries(nbOfInscriptionsByEvent).map(([eid, quantity]) => {
                        const event = parsedCompetition.events.find((e) => e.eid === eid);
                        if (!event) throw new Error('Event not found');
                        return {
                            price_data: {
                                currency: 'eur',
                                product_data: {
                                    name: `${event.name}`
                                },
                                unit_amount: event.cost * 100
                            },
                            quantity
                        };
                    })];

                    if (fees > 0) {
                        lineItems.push({
                            price_data: {
                                currency: 'eur',
                                product_data: {
                                    name: req.t('glossary.fees')
                                },
                                unit_amount: fees * 100
                            },
                            quantity: 1
                        });
                    }

                    const session = await createCheckoutSession(
                        lineItems,
                        `${env.BASE_URL}/competitions/${eid}/register?isPending`,
                        `${env.BASE_URL}/competitions/${eid}/register?isCanceled`,
                        req.user!.email,
                        alreadyPaid * 100,
                        {
                            type: WebhookType.INSCRIPTIONS,
                            competitionEid: eid,
                            userId: req.user!.id,
                            lng: req.language,
                            ...inscriptions.reduce((acc, i, index) => {
                                acc[index.toString()] = JSON.stringify(i);
                                return acc;
                            }, {} as { [key: string]: string })
                        }
                    );
                    res.send(session.url);
                    return;
                } catch (e) {
                    if (e instanceof Error && e.message === 'Event not found') {
                        catchError(logger)(e, {
                            message: 'Event not found',
                            path: 'POST /:eid/inscriptions',
                            status: 404,
                            userId: req.user?.id
                        });
                        res.status(404).send('Event not found');
                        return;
                    }
                    // Rethrow the error if it's not a known error
                    throw e;
                }
            }

            // Save free inscriptions
            const inscriptions = await saveInscriptions(
                eid, 
                await Promise.all(inscriptionsData.map(async ({ athleteLicense, inscriptions }) => {
                    const athlete = await findAthleteWithLicense(athleteLicense, z.array(Athlete$).parse(competition.oneDayAthletes));
                    const userId = req.user!.id;
                    return {
                        userId,
                        athlete,
                        inscriptions: inscriptions.map((data) => {
                            return {
                                data,
                                meta: {
                                    status: InscriptionStatus.ACCEPTED,
                                },
                                
                            };
                        })
                    };
                })),
                Inscription$.array().parse(competition.inscriptions),
                alreadyPaid,
                parsedCompetition.events
            );
            sendEmailInscription(inscriptionsData, totalCost, parsedCompetition.events, req.user!.email, competition.name, req.t);
            res.send([...inscriptions.createdInscriptions, ...inscriptions.updatedInscriptions]);
        } catch (e) {
            catchError(logger)(e, {
                message: 'Internal server error',
                path: 'POST /:eid/inscriptions',
                status: 500,
                userId: req.user?.id
            });
            res.status(500).send(req.t('error.internalServerError'));
        }
    }
);
