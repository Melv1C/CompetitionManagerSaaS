import {
    checkAdminRole,
    checkRole,
    CustomRequest,
    Key,
    parseRequest,
} from '@competition-manager/backend-utils';
import { prisma } from '@competition-manager/prisma';
import {
    Access,
    BaseAdmin$,
    CompetitionEvent$,
    competitionEventInclude,
    CreateCompetitionEvent$,
    Eid$,
    Role,
} from '@competition-manager/schemas';
import { isAuthorized } from '@competition-manager/utils';
import { Router } from 'express';
import { z } from 'zod';

export const router = Router();

const Params$ = z.object({
    competitionEid: Eid$,
});

router.post(
    '/:competitionEid/events',
    parseRequest(Key.Params, Params$),
    parseRequest(Key.Body, CreateCompetitionEvent$),
    checkRole(Role.ADMIN),
    async (req: CustomRequest, res) => {
        try {
            const { competitionEid } = Params$.parse(req.params);
            const { eventId, categoriesId, parentEid, ...competitionEvent } =
                CreateCompetitionEvent$.parse(req.body);
            const competition = await prisma.competition.findUnique({
                where: {
                    eid: competitionEid,
                },
                include: {
                    admins: {
                        select: {
                            access: true,
                            userId: true,
                        },
                    },
                },
            });
            if (!competition) {
                res.status(404).send('Competition not found');
                return;
            }
            if (
                !isAuthorized(req.user!, Role.SUPERADMIN) &&
                !checkAdminRole(
                    Access.COMPETITIONS,
                    req.user!.id,
                    z.array(BaseAdmin$).parse(competition.admins),
                    res,
                    req.t
                )
            ) {
                return;
            }
            if (competitionEvent.schedule < competition.date) {
                res.status(400).send(
                    'Event date must be after competition date'
                );
                return;
            }
            if (
                competition.closeDate &&
                competitionEvent.schedule > competition.closeDate
            ) {
                res.status(400).send(
                    'Event date must be before competition close date'
                );
                return;
            }
            try {
                const newCompetitionEvent =
                    await prisma.competitionEvent.create({
                        data: {
                            ...competitionEvent,
                            event: {
                                connect: {
                                    id: eventId,
                                },
                            },
                            categories: {
                                connect: categoriesId.map((id) => ({ id })),
                            },
                            competition: {
                                connect: {
                                    eid: competitionEid,
                                },
                            },
                            ...(parentEid && {
                                parentEvent: { connect: { eid: parentEid } },
                            }),
                        },
                        include: competitionEventInclude,
                    });
                res.send(CompetitionEvent$.parse(newCompetitionEvent));
            } catch (e: any) {
                if (e.code === 'P2025') {
                    res.status(404).send('Wrong category id or event id');
                    return;
                } else {
                    console.error(e);
                    res.status(500).send(req.t('error.internalServerError'));
                    return;
                }
            }
        } catch (e) {
            console.error(e);
            res.status(500).send(req.t('error.internalServerError'));
        }
    }
);
