import { Router } from 'express';
import { prisma } from '@competition-manager/prisma';
import { Competition$, DisplayInscription$ } from '@competition-manager/schemas';
import { AuthenticatedRequest, Key, parseRequest } from '@competition-manager/backend-utils';

export const router = Router();

const Params$ = Competition$.pick({
    eid: true
});

router.get(
    '/:eid/inscriptions',
    parseRequest(Key.Params, Params$),
    async (req: AuthenticatedRequest, res) => {
        try {
            const { eid } = Params$.parse(req.params);
            const competition = await prisma.competition.findUnique({
                where: {
                    eid
                },
                include: {
                    inscriptions: {
                        where: {
                            isDeleted: false
                        },
                        include: {
                            club: true,
                            competitionEvent: {
                                include: {
                                    event: true,
                                    categories: true
                                }
                            },
                            athlete: true,
                            record: true
                        }
                    }
                }
            });
            if (!competition) {
                res.status(404).send('Competition not found');
                return;
            }
            res.send(DisplayInscription$.array().parse(competition.inscriptions));
        } catch(error) {
            console.error(error);
            res.status(500).send('Internal server error');
        }
    }
);