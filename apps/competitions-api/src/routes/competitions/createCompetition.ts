import { Router } from 'express';
import { prisma } from '@competition-manager/prisma';
import { z } from 'zod';
import { parseRequest, AuthenticatedRequest, checkRole } from '@competition-manager/utils';
import { Competition$ } from '@competition-manager/schemas';

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

const Body$ = Competition$.pick({
    name: true,
    date: true,
    method: true
}).extend({
    paymentPlanId: z.number(),
    optionsId: z.array(z.number()).optional(),
});

router.post(
    '/',
    parseRequest('body', Body$),
    checkRole('club'),
    async (req: AuthenticatedRequest, res) => {
        //stripe a faire


        const body = Body$.parse(req.body);
        const competition = NewCompetition$.parse(body);
        const { paymentPlanId, optionsId } = body;
        const user = req.user;
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
                        access: ['owner'],
                        user: {
                            connect: {
                                id: user!.id
                            }
                        }
                    }
                }
            }
        });
        res.send(newCompetition);
    }
    
);