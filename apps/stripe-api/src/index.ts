import 'dotenv/config';
import express from "express";
import i18next from "i18next";
import Backend from "i18next-fs-backend";
import middleware from "i18next-http-middleware";
import { z } from 'zod';

import { Athlete$, CompetitionEvent$, CreateInscription, CreateInscription$, Inscription$, InscriptionStatus, License, StripeInscriptionMetadata$, WebhookType, WebhookType$ } from '@competition-manager/schemas';
import { corsMiddleware, findAthleteWithLicense, Key, parseRequest, saveInscriptions, sendEmailInscription } from '@competition-manager/backend-utils';
import { backendTranslations } from "@competition-manager/translations";

import { env } from "./env";
import { prisma } from '@competition-manager/prisma';

i18next.use(Backend).use(middleware.LanguageDetector).init({
    resources: backendTranslations,
    fallbackLng: 'en'
});

const app = express();
app.use(express.json());

app.use(corsMiddleware);

app.use(middleware.handle(i18next));

const Body$ = z.object({
    data: z.object({
        object: z.object({
            metadata: z.any(),
        }),
    }),
});

app.post(`${env.PREFIX}/stripe/webhook`, 
    parseRequest(Key.Body, Body$),
    async (req, res) => {
        try {
            const { metadata } = Body$.parse(req.body).data.object;
            const user = await prisma.user.findUnique({
                where: {
                    id: metadata.userId,
                },
            });
            if (!user) throw new Error('User not found');
            console.log(user);
            switch (WebhookType$.parse(metadata.type)) {
                case WebhookType.INSCRIPTIONS:
                    console.log('Payment intent webhook received', metadata);

                    const inscriptions = Object.entries(metadata)
                        .filter(([key]) => !isNaN(+key))
                        .sort(([a], [b]) => +a - +b)
                        .map(([_, value]) => JSON.parse(value as string));

                    const inscriptionsData = StripeInscriptionMetadata$.parse({
                        ...metadata,
                        inscriptions,
                    });

                    const inscriptionsGroupedByAthlete = Object.values(inscriptionsData.inscriptions.reduce((acc, inscription) => {
                        if (!acc[inscription.athlete]) {
                            acc[inscription.athlete] = {
                                athleteLicense: inscription.athlete,
                                inscriptions: [],
                            };
                        }
                        acc[inscription.athlete].inscriptions.push({
                            competitionEventEid: inscription.event,
                            record: inscription.record,
                        });
                        return acc;
                    }, {} as Record<string, { athleteLicense: License, inscriptions: CreateInscription["inscriptions"] }>));

                    const competition = await prisma.competition.findUnique({
                        where: {
                            eid: inscriptionsData.competitionEid,
                        },
                        include: {
                            oneDayAthletes: true,
                            events: {
                                include: {
                                    categories: true,
                                    event: true
                                }
                            },
                            inscriptions: {
                                include: {
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
                    if (!competition) throw new Error('Competition not found');

                    saveInscriptions(
                        inscriptionsData.competitionEid, 
                        await Promise.all(inscriptionsGroupedByAthlete.map(async ({ athleteLicense, inscriptions }) => {
                            const athlete = await findAthleteWithLicense(athleteLicense, z.array(Athlete$).parse(competition.oneDayAthletes));
                            const userId = inscriptionsData.userId;
                            return {
                                userId,
                                athlete,
                                inscriptions: inscriptions.map((data) => {
                                    const event = competition.events.find((e) => e.eid === data.competitionEventEid);
                                    if (!event) throw new Error('Event not found');
                                    return {
                                        data,
                                        meta: {
                                            status: InscriptionStatus.ACCEPTED,
                                            paid: event.cost, //TODO: Compute knowing the already paid amount
                                        },
                                        
                                    };
                                })
                            };
                        })),
                        Inscription$.array().parse(competition.inscriptions)
                    )
                    const totalCost = inscriptionsData.inscriptions.reduce((acc, inscription) => {
                        const event = competition.events.find((e) => e.eid === inscription.event);
                        if (!event) throw new Error('Event not found');
                        return acc + event.cost;
                    }, 0);
                    sendEmailInscription(CreateInscription$.array().parse(inscriptionsGroupedByAthlete), totalCost, CompetitionEvent$.array().parse(competition.events), user.email, competition.name, req.t);
                    
                    break;
                default:
                    throw new Error('Unknown webhook type');
            }

            res.send('OK');

        } catch (e: any) {
            console.error(e);
            res.status(500).send(e.message);
        }
    }
);


app.listen(env.PORT, () => {
    console.log(`Server is running on port ${env.PORT}`);
});

