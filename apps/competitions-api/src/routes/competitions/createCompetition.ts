import { Router } from 'express';
import { prisma } from '@competition-manager/prisma';
import { z } from 'zod';
import { parseRequest, verifyAccessToken } from '@competition-manager/utils';
import { PAYMENT_METHOD, Competition$ } from '@competition-manager/schemas';

export const router = Router();

const NewCompetition$ = Competition$.pick({
    name: true,
    date: true,
    method: true,
    publish: true,
    description: true,
    oneDayBibStart: true,
    oneDayPermissions: true,
});

const Body$ = z.object({
    name: z.string(),
    date: z.coerce.date().min(new Date()),
    method: z.enum(PAYMENT_METHOD),
    paymentPlanId: z.number(),
    optionsId: z.array(z.number()).optional(),
    accessToken: z.string(),
});

router.post(
    '/',
    parseRequest('body', Body$),
    async (req, res) => {
        //stripe a faire


        const body = Body$.parse(req.body);
        const competition = NewCompetition$.parse(body);
        const { paymentPlanId, optionsId, accessToken } = body;
        console.log(accessToken);
        const valid = verifyAccessToken(accessToken);
        if (!valid) {
            res.status(401).send('Unauthorized');
            return;
        }
        const userId = valid.id;
        console.log(userId);
        const user = await prisma.user.findUnique({
            where: {
                id: userId
            },
            select: {
                email: true,
                role: true
            }
        });
        if (!user) {
            res.status(404).send('User not found');
            return;
        }
        if (user.role !== 'club') {
            res.status(401).send('Unauthorized user');
            return;
        }

        const newCompetition = await prisma.competition.create({
            data: {
                ...competition,
                email: user!.email,
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
                        access: ['owner', 'inscriptions', 'competitions', 'confirmations', 'liveResults'], //tout mettre ou juste owner ?
                        user: {
                            connect: {
                                id: userId
                            }
                        }
                    }
                }
            }
        });
        res.send(newCompetition);
    }
    
);