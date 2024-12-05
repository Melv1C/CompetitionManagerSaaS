import { Router } from 'express';
import { prisma } from '@competition-manager/prisma';
import { z } from 'zod';
import { parseRequest, verifyAccessToken } from '@competition-manager/utils';
import { CompetitionEvent$ } from '@competition-manager/schemas';

export const router = Router();


const NewCompetitionEvent$ = CompetitionEvent$.pick({
    name: true,
    schedule: true,
    place: true,
    cost: true,
    isInscriptionOpen: true,
});

const Params$ = z.object({
    eid: z.string()
});

const Body$ = z.object({
    name: z.string(),
    eventId: z.number(),
    schedule: z.coerce.date().min(new Date()),
    categoriesId: z.array(z.number()),
    place: z.number().positive().int().optional(),
    parentId: z.number().positive().optional(),
    cost: z.number().nonnegative(),
    isInscriptionOpen: z.boolean().default(true),
    accessToken: z.string(),
});

router.post(
    '/:eid/events',
    parseRequest('params', Params$),
    parseRequest('body', Body$),
    async (req, res) => {
        const { eid } = Params$.parse(req.params);
        const body = Body$.parse(req.body);
        const competitionEvent = NewCompetitionEvent$.parse(body);
        const { eventId, categoriesId, accessToken, parentId } = body;
        const userInfo = verifyAccessToken(accessToken);
        if (!userInfo) {
            res.status(401).send('Unauthorized');
            return;
        }
        const competition = await prisma.competition.findUnique({
            where: {
                eid,
            },
            include: {
                admins: true
            }
        });
        if (!competition) {
            res.status(404).send('Competition not found');
            return;
        }
        const admin = competition.admins.find(admin => admin.id === userInfo.id);
        if (!admin || admin.access.includes('competitions') === false) {
            res.status(401).send('Unauthorized');
            return;
        }
        const event = await prisma.event.findUnique({
            where: {
                id: eventId
            }
        });
        if (!event) {
            res.status(404).send('Event not found');
            return;
        }
        const categories = await prisma.category.findMany({
            where: {
                id: {
                    in: categoriesId
                }
            }
        });
        if (categories.length !== categoriesId.length) {
            res.status(404).send('Category not found');
            return;
        }
        const newCompetitionEvent = await prisma.competitionEvent.create({
            data: {
                ...competitionEvent,
                event: {
                    connect: {
                        id: eventId
                    }
                },
                categories: {
                    connect: categoriesId.map(id => ({ id }))
                },
                competition: {
                    connect: {
                        id: competition.id
                    }
                },
                ...(parentId && { parentEvent: { connect: { id: parentId } } })
            }
        });
        res.send(newCompetitionEvent);
    }
);
