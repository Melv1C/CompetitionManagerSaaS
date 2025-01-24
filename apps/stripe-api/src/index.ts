import express from "express";
import 'dotenv/config';

import { corsMiddleware, Key, parseRequest } from '@competition-manager/backend-utils';
import { prisma } from "@competition-manager/prisma";
import { z } from 'zod';
import { Bib$, DefaultInscription$, Id$, NODE_ENV, Record$ } from "@competition-manager/schemas";

const env$ = z.object({
    NODE_ENV: z.nativeEnum(NODE_ENV).default(NODE_ENV.STAGING),
    PORT: z.string().default('3000'),
    PREFIX: z.string().default('/api'),
    ALLOW_ORIGIN: z.string().default('*')
});

export const env = env$.parse(process.env);

const app = express();
app.use(express.json());

app.use(corsMiddleware);

const Body$ = z.object({
    data: z.object({
        object: z.object({
            metadata: z.any(),
        }),
    }),
});

const Isncription$ = z.object({
    competitionId: Id$,  
    athleteId: Id$,
    competitionEventId: Id$,
    record: Record$.nullish(),
    userId: Id$,
    bib: Bib$,
    clubId: Id$,
});

app.post(`${env.PREFIX}/stripe/webhook`, 
    parseRequest(Key.Body, Body$),
    async (req, res) => {
        try {
            const { metadata } = Body$.parse(req.body).data.object;
            const user = prisma.user.findUnique({
                where: {
                    id: metadata.userId,
                },
            });
            if (!user) throw new Error('User not found');
            console.log(user);
            switch (metadata.type) {
                case 'inscription':
                    console.log('Payment intent webhook received', metadata);
                    
                    const inscriptions = Isncription$.array().parse(JSON.parse(metadata.inscriptions));

                    for (const inscription of inscriptions) {
                        const defaultInscription = DefaultInscription$.parse(inscription);
                        const newInscription = await prisma.inscription.create({
                            data: {
                                athlete: {
                                    connect: {
                                        id : inscription.athleteId
                                    }
                                },
                                competition: {
                                    connect: {
                                        id: inscription.competitionId
                                    }
                                },
                                user: {
                                    connect: {
                                        id: inscription.userId
                                    }
                                },
                                bib: inscription.bib,
                                ...(inscription.record ? {
                                    record: {
                                        create: inscription.record
                                    }
                                } : {}),
                                club: {
                                    connect: {
                                        id: inscription.clubId
                                    }
                                },
                                competitionEvent: {
                                    connect: {
                                        id: inscription.competitionEventId
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
                        console.log(newInscription);
                    }
                    
                    break;
                default:
                    throw new Error('Unknown webhook type');
            }


            console.log('Stripe webhook received', metadata);
            res.send('Stripe webhook received');
        } catch (e: any) {
            console.error(e);
            res.status(500).send(e.message);
        }
    }
);


app.listen(env.PORT, () => {
    console.log(`Server is running on port ${env.PORT}`);
});

