import { Router } from 'express';
import { prisma } from '@competition-manager/prisma';
import { z } from 'zod';
import { parseRequest, checkRole, checkAdminRole, AuthentificatedRequest, Key } from '@competition-manager/backend-utils';
import { BaseAdmin$, Eid$, UpdateCompetitionEvent$, Access, Role, CompetitionEvent$ } from '@competition-manager/schemas';

export const router = Router();

const Params$ = z.object({
    competitionEid: Eid$,
    eventEid: Eid$
});

router.put(
    '/:competitionEid/events/:eventEid',
    parseRequest(Key.Params, Params$),
    parseRequest(Key.Body, UpdateCompetitionEvent$),
    checkRole(Role.ADMIN),
    async (req: AuthentificatedRequest, res) => {
        try{
            const { competitionEid, eventEid } = Params$.parse(req.params);
            const { categoriesId, parentEid, eventId, ...competitionEvent } = UpdateCompetitionEvent$.parse(req.body);
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
            if (competition.closeDate && competitionEvent.schedule > competition.closeDate){
                res.status(400).send('Event date must be before competition close date');
                return;
            }
            try{
                const newCompetitionEvent = await prisma.competitionEvent.update({
                    where: {
                        eid: eventEid
                    },
                    data: {
                        ...competitionEvent,
                        categories: {
                            set: categoriesId.map(id => ({ id }))
                        },
                        event: {
                            connect: {
                                id: eventId
                            }
                        },
                        ...(parentEid && { parentEvent: { connect: { eid: parentEid } } }),

                    },
                    include: {
                        event: true,
                        categories: true,
                    }
                });
                res.send(CompetitionEvent$.parse(newCompetitionEvent));
            } catch(e: any) {
                if (e.code === 'P2025') {
                    res.status(404).send('Wrong category id');
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
