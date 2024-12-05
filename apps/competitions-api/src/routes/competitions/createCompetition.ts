import { Router } from 'express';
import { prisma } from '@competition-manager/prisma';
import { z } from 'zod';
import { parseRequest, authMiddleware, AuthenticatedRequest } from '@competition-manager/utils';
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
});

router.post(
    '/',
    parseRequest('body', Body$),
    authMiddleware('club'),
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