import { Router } from 'express';
import { prisma } from '@competition-manager/prisma';
import { z } from 'zod';
import { parseRequest, checkRole, checkAdminRole, AuthenticatedRequest } from '@competition-manager/utils';
import { BaseAdmin$, Eid$, BaseCompetitionEvent$, Id$ } from '@competition-manager/schemas';

export const router = Router();

const Params$ = z.object({
    competitionEid: Eid$,
    eventEid: Eid$
});

const Body$ = BaseCompetitionEvent$.extend({
    categoriesId: z.array(Id$),
    parentId: Id$.optional()
});

router.put(
    '/:competitionEid/events/eventEid',
    parseRequest('params', Params$),
    parseRequest('body', Body$),
    checkRole('admin'),
    async (req: AuthenticatedRequest, res) => {
        try{
            const { competitionEid, eventEid } = Params$.parse(req.params);
            const body = Body$.parse(req.body);
            const competitionEvent = BaseCompetitionEvent$.parse(body);
            const { categoriesId, parentId } = body;
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
            if (!checkAdminRole('competitions', req.user!.id, z.array(BaseAdmin$).parse(competition.admins), res)) {
                return;
            }
            if (competitionEvent.schedule < competition.date) {
                res.status(400).send('Event date must be after competition date');
                return;
            }
            if (competition.closeDate){
                if (competitionEvent.schedule > competition.closeDate) {
                    res.status(400).send('Event date must be before competition close date');
                    return;
                }
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
                        ...(parentId && { parentEvent: { connect: { id: parentId } } })
                    }
                });
                res.send(newCompetitionEvent);
            } catch(e: any) {
                if (e.code === 'P2025') {
                    res.status(404).send('Wrong category id');
                    return;
                }else{
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
