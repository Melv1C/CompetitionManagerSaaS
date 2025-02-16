import 'dotenv/config';
import express from "express";
import i18next from "i18next";
import Backend from "i18next-fs-backend";
import middleware from "i18next-http-middleware";
import { z } from 'zod';

import { Athlete$, athleteInclude, Competition$, CompetitionEvent$, competitionInclude, CreateInscription, CreateInscription$, Inscription$, inscriptionsInclude, InscriptionStatus, License, StripeInscriptionMetadata$, WebhookType, WebhookType$ } from '@competition-manager/schemas';
import { corsMiddleware, findAthleteWithLicense, Key, parseRequest, saveInscriptions, sendEmailInscription } from '@competition-manager/backend-utils';
import { backendTranslations } from "@competition-manager/translations";

import { env } from "./env";
import { prisma } from '@competition-manager/prisma';
import { getCostsInfo } from '@competition-manager/utils';

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

                    const user = await prisma.user.findUnique({
                        where: {
                            id: inscriptionsData.userId,
                        },
                    });
                    if (!user) throw new Error('User not found');

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
                            ...competitionInclude,
                            oneDayAthletes: {
                                include: athleteInclude,
                            },
                            inscriptions: {
                                include: inscriptionsInclude,
                            }
                        }
                    });
                    if (!competition) throw new Error('Competition not found');

                    const { alreadyPaid, totalToPay, totalCost } = (await Promise.all(inscriptionsGroupedByAthlete.map(async ({ athleteLicense, inscriptions }) => {
                        const athlete = await findAthleteWithLicense(athleteLicense, z.array(Athlete$).parse(competition.oneDayAthletes));
                        return getCostsInfo(Competition$.parse(competition), athlete, inscriptions.map((i) => i.competitionEventEid), Inscription$.array().parse(competition.inscriptions).filter((i) => i.user.id === inscriptionsData.userId));
                    }))).reduce((acc, { totalCost, alreadyPaid, totalToPay }) => {
                        acc.totalCost += totalCost;
                        acc.alreadyPaid += alreadyPaid;
                        acc.totalToPay += totalToPay;
                        return acc;
                    }, { totalCost: 0, alreadyPaid: 0, totalToPay: 0 });

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
                                        },
                                        
                                    };
                                })
                            };
                        })),
                        Inscription$.array().parse(competition.inscriptions),
                        alreadyPaid + totalToPay,
                        CompetitionEvent$.array().parse(competition.events),
                    )

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

