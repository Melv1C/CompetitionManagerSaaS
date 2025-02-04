import { Router } from 'express';
import { parseRequest, AuthenticatedRequest, checkAdminRole, checkRole, Key, saveInscriptions, findAthleteWithLicense } from '@competition-manager/backend-utils';
import { Competition$, CreateInscription$, BaseAdmin$, Athlete$, Access, Role, Inscription$, AdminQuery$, InscriptionStatus, Eid, WebhookType } from '@competition-manager/schemas';
import { z } from 'zod';
import { prisma } from '@competition-manager/prisma';
import { createCheckoutSession } from '@competition-manager/stripe';
import { getCategoryAbbr, getFees, isAuthorized } from '@competition-manager/utils';

export const router = Router();

const Params$ = Competition$.pick({
    eid: true
});

router.post(
    '/:eid/inscriptions',
    parseRequest(Key.Params, Params$),
    parseRequest(Key.Body, CreateInscription$.array()),
    parseRequest(Key.Query, AdminQuery$),
    checkRole(Role.USER),
    async (req: AuthenticatedRequest, res) => {
        try {
            const { isAdmin } = AdminQuery$.parse(req.query);
            const { eid } = Params$.parse(req.params);
            const inscriptionsData = CreateInscription$.array().parse(req.body);
            if (inscriptionsData.length === 0) {
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
                if (!checkAdminRole(Access.INSCRIPTIONS, req.user!.id, BaseAdmin$.array().parse(competition.admins), res)) return;
            }

            const competition = await prisma.competition.findUnique({
                where: {
                    eid
                },
                include: {
                    oneDayAthletes: true,
                    inscriptions: {
                        include: {
                            ...competitionInclude,
                            user: true,
                            athlete: true,
                            club: true,
                            competitionEvent: {
                                include: {
                                    event: true,
                                    categories: true
                                }
                            },
                            record: true
                        }
                    }
                }
            });

            if (!competition) {
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

            if (isAdmin) {
                res.send(
                    saveInscriptions(
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
                                            status: InscriptionStatus.ACCEPTED,
                                            paid: 0
                                        },
                                        
                                    };
                                })
                            };
                        })),
                        Inscription$.array().parse(competition.inscriptions)
                    )
                );
                return;
            }

            const totalCost = inscriptionsData.reduce((acc, { inscriptions }) => acc + inscriptions.reduce((acc, { competitionEventEid }) => acc + competition.events.find((e) => e.eid === competitionEventEid)!.cost || 0, 0), 0);
            const alreadyPaid = competition.inscriptions.filter((i) => i.user.id === req.user!.id && inscriptionsData.some(({ athleteLicense }) => athleteLicense === i.athlete.license)).reduce((acc, i) => acc + i.paid, 0);
            const fees = getFees(totalCost - alreadyPaid);
            const total = Math.max(0, totalCost - alreadyPaid) + fees;

            const nbOfInscriptionsByEvent = inscriptionsData.reduce((acc, { inscriptions }) => {
                inscriptions.forEach(({ competitionEventEid }) => {
                    acc[competitionEventEid] = (acc[competitionEventEid] || 0) + 1;
                });
                return acc;
            }, {} as Record<Eid, number>);

            if (total > 0) {
                // TODO: Fix the url
                const fullUrl = req.protocol + '://' + req.get("host") + req.originalUrl;
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

                    const session = await createCheckoutSession(
                        [...Object.entries(nbOfInscriptionsByEvent).map(([eid, quantity]) => {
                            const event = competition.events.find((e) => e.eid === eid);
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
                        }), {
                            price_data: {
                                currency: 'eur',
                                product_data: {
                                    name: `Fees` //TODO: Translate
                                },
                                unit_amount: Math.round(fees * 100)
                            },
                            quantity: 1
                        }],
                        fullUrl,
                        fullUrl,

                        req.user!.email,
                        alreadyPaid * 100,
                        {
                            type: WebhookType.INSCRIPTIONS,
                            competitionEid: eid,
                            userId: req.user!.id,
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
                        res.status(404).send('Event not found');
                        return;
                    }
                    console.error(e);
                    res.status(500).send('Internal server error');
                    return;
                }
            }

            // Save free inscriptions
            res.send(
                saveInscriptions(
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
                                        paid: 0
                                    },
                                    
                                };
                            })
                        };
                    })),
                    Inscription$.array().parse(competition.inscriptions)
                )
            );

        } catch (e: any) {
            if (e.code === 'P2025') {
                res.status(404).send('Athlete not found');
                return;
            } else{
                console.error(e);
                res.status(500).send('Internal server error');
                return;
            }
        }
    }
);
