import express from "express";
import 'dotenv/config';

import { corsMiddleware, Key, parseRequest } from '@competition-manager/utils';
import { prisma } from "@competition-manager/prisma";
import { z } from 'zod';
import { DefaultCompetition$, DefaultInscription$ } from "../../../shared-packages/schemas/src";

// Ensure Id$ is defined as a ZodTypeAny
const Id$ = z.number();

const app = express();
app.use(express.json());

const PORT = process.env.PORT || 3000;
const PREFIX = process.env.PREFIX || '/api';

app.use(corsMiddleware);

const Body$ = z.object({
    data: z.object({
        object: z.object({
            metadata: z.any(),
        }),
    }),
});

const Isncription$ = z.object({
    athleteId: Id$,
    competitionEventId: Id$,
});

app.post(`${PREFIX}/stripe/webhook`, 
    //parseRequest(Key.Body, Body$),
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

                    for (const { athleteId, competitionEventId, ...inscription } of inscriptions) {
                        const newInscription = await prisma.inscription.create({
                            data: {
                                athlete: {
                                    connect: {
                                        id: athleteId,
                                    },
                                },
                                competitionEvent: {
                                    connect: {
                                        id: competitionEventId,
                                    },
                                },
                                competition: {
                                    connect: {
                                        id: metadata.competitionId,
                                    },
                                },
                                ...DefaultInscription$.parse(inscription),
                            },
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


app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});

