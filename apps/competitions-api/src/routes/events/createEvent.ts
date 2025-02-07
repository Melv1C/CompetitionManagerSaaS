import { Router } from 'express';
import { prisma } from '@competition-manager/prisma';
import { z } from 'zod';
import { parseRequest, checkRole, checkAdminRole, AuthentificatedRequest, Key } from '@competition-manager/backend-utils';
import { BaseAdmin$, Eid$, CreateCompetitionEvent$, Access, Role, CompetitionEvent$ } from '@competition-manager/schemas';

export const router = Router();

const Params$ = z.object({
    competitionEid: Eid$
});

router.post(
    '/:competitionEid/events',
    parseRequest(Key.Params, Params$),
    parseRequest(Key.Body, CreateCompetitionEvent$),
    checkRole(Role.ADMIN),
    async (req: AuthentificatedRequest, res) => {
        try{
            const { competitionEid } = Params$.parse(req.params);
            const { eventId, categoriesId, parentEid, ...competitionEvent } = CreateCompetitionEvent$.parse(req.body);
            const competition = await prisma.competition.findUnique({
                where: {
                    eid: competitionEid
                },
                include: {
                    admins: {
                        select: {
                            access: true,
                            userId: true
                        }
                    },
                }
            });
            if (!competition) {
                res.status(404).send('Competition not found');
                return;
            }
            if (!checkAdminRole(Access.COMPETITIONS, req.user!.id, z.array(BaseAdmin$).parse(competition.admins), res)) {
                return;
            }
            if (competitionEvent.schedule < competition.date) {
                res.status(400).send('Event date must be after competition date');
                return;
            }
            if (competition.closeDate && competitionEvent.schedule > competition.closeDate) {
                res.status(400).send('Event date must be before competition close date');
                return;
            }
            try{
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
                                eid: competitionEid
                            }
                        },
                        ...(parentEid && { parentEvent: { connect: { eid: parentEid } } })
                    },
                    include: {
                        event: true,
                        categories: true
                    }
                });
                res.send(CompetitionEvent$.parse(newCompetitionEvent));
            } catch(e: any) {
                if (e.code === 'P2025') {
                    res.status(404).send('Wrong category id or event id');
                    return;
                } else{
                    console.error(e);
                    res.status(500).send('internalServerError');
                    return;
                }
            }
        } catch (e) {
            console.error(e);
            res.status(500).send('internalServerError');
        }
    }
);
