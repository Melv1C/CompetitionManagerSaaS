import { Router } from 'express';
import { parseRequest, AuthenticatedRequest, checkAdminRole, checkRole, Key } from '@competition-manager/backend-utils';
import { Competition$, CreateInscription$, DefaultInscription$, BaseAdmin$, Athlete, Athlete$, Access, Role, Inscription$, License } from '@competition-manager/schemas';
import { z } from 'zod';
import { prisma } from '@competition-manager/prisma';
import { createCheckoutSession } from '@competition-manager/stripe';

export const router = Router();

const findAthleteWithLicense = async (license: License, oneDayAthletes: Athlete[] = []) => {
    return oneDayAthletes.find((a) => a.license === license) || Athlete$.parse(await prisma.athlete.findFirstOrThrow({
        where: {
            license: license,
            competitionId: null
        },
        include: {
            club: true
        }
    }));
}
const Params$ = Competition$.pick({
    eid: true
});

const Query$ = z.object({
    isAdmin: z.coerce.boolean().default(false),
});

router.post(
    '/:eid/inscriptions',
    parseRequest(Key.Params, Params$),
    parseRequest(Key.Body, z.array(CreateInscription$)),
    parseRequest(Key.Query, Query$),
    checkRole(Role.USER),
    async (req: AuthenticatedRequest, res) => {
        try {
            //TODO check place 
            //TODO check if the event is open
            //TODO check if the athlete is in the right category
            const { isAdmin } = Query$.parse(req.query);
            const { eid } = Params$.parse(req.params);
            const inscriptions = CreateInscription$.array().parse(req.body);

            const competition = await prisma.competition.findUnique({
                where: {
                    eid
                },
                include: {
                    admins: true,
                    oneDayAthletes: true,
                    events: {
                        include: {
                            categories: true,
                            event: true
                        }
                    }
                }
            });

            if (!competition) {
                res.status(404).send('Competition not found');
                return;
            }
            
            if (!isAdmin){
                const fullUrl = req.protocol + '://' + req.get("host") + req.originalUrl;
                try {
                    const session = await createCheckoutSession(
                        inscriptions.map(({ competitionEventEid }) => {
                            const event = competition.events.find((e) => e.eid === competitionEventEid);
                            if (!event) throw new Error('Event not found');
                            return {
                                price_data: {
                                    currency: 'eur',
                                    product_data: {
                                        name: `${event.name}`,
                                    },
                                    unit_amount: event.cost * 100,
                                },
                                quantity: 1,
                            };
                        }),
                        fullUrl,
                        fullUrl,
                        req.user!.email,
                        {
                            inscriptions: JSON.stringify(inscriptions.map( async ({ athleteLicense, competitionEventEid, record }) => {
                                const athlete = await findAthleteWithLicense(athleteLicense, z.array(Athlete$).parse(competition.oneDayAthletes));
                                const event = competition.events.find((e) => e.eid === competitionEventEid);
                                if (!event) throw new Error('Event not found');
                                return {
                                    athleteId: athlete.id,
                                    bib: athlete.bib,
                                    clubId: athlete.club.id,
                                    competitionEventId: event.id,
                                    record,
                                    competitionId: competition.id,
                                    userId: req.user!.id,
                                    type: "inscriptions",
                                };
                            }))
                        }
                    );
                    console.log(session.url);
                    res.send(session.url || '/qsrgqerh');
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

            if (!checkAdminRole(Access.INSCRIPTIONS, req.user!.id, z.array(BaseAdmin$).parse(competition.admins), res)){
                return;
            }

            try {
                const listInscriptions = [];
                for (const { athleteLicense, competitionEventEid, record, ...inscription } of inscriptions) {
                    const defaultInscription = DefaultInscription$.parse(inscription);
                    const athlete = await findAthleteWithLicense(athleteLicense, z.array(Athlete$).parse(competition.oneDayAthletes));
                    const newInscription = await prisma.inscription.create({
                        data: {
                            athlete: {
                                connect: {
                                    id : athlete.id
                                }
                            },
                            competition: {
                                connect: {
                                    eid: eid
                                }
                            },
                            user: {
                                connect: {
                                    id: req.user!.id
                                }
                            },
                            bib: athlete.bib,
                            ...(record ? {
                                record: {
                                    create: record
                                }
                            } : {}),
                            club: {
                                connect: {
                                    id: athlete.club.id
                                }
                            },
                            competitionEvent: {
                                connect: {
                                    eid: competitionEventEid
                                }
                            },
                            ...defaultInscription
                        },
                        include: {
                            athlete: {
                                include: {
                                    club: true
                                }
                            },
                            competitionEvent: {
                                include: {
                                    event: true,
                                    categories: true
                                }
                            },
                            user: true,
                            club: true,
                            record: true
                        }
                    });
                    listInscriptions.push(newInscription);
                }
                res.status(201).send(Inscription$.array().parse(listInscriptions));
            } catch (e: any) {
                if (e.code === 'P2025') {
                    res.status(404).send('Athlete license not valid');
                    return;
                } else{
                    console.error(e);
                    res.status(500).send('Internal server error');
                    return;
                }
            }
        } catch (e) {
            console.error(e);
            res.status(500).send('Internal server error');
        }
    }
);
