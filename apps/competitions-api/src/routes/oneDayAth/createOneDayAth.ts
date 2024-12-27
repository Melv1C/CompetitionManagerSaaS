import { Router } from 'express';
import { prisma } from '@competition-manager/prisma';
import { z } from 'zod';
import { parseRequest, checkRole, AuthenticatedRequest } from '@competition-manager/utils';
import { Eid$, OneDayAthlete$, Role } from '@competition-manager/schemas';

export const router = Router();

const Params$ = z.object({
    competitionEid: Eid$
});

router.post(
    '/:competitionEid/oneDayAthlete',
    parseRequest('params', Params$),
    parseRequest('body', OneDayAthlete$),
    checkRole(Role.USER),
    async (req: AuthenticatedRequest, res) => {
        try{
            const { competitionEid } = Params$.parse(req.params);
            const oneDayAthData = OneDayAthlete$.parse(req.body);
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
                    oneDayAthletes: {
                        select: {
                            bib: true
                        }
                    }
                }
            });
            if (!competition) {
                res.status(404).send('Competition not found');
                return;
            }
            const newBib = competition.oneDayAthletes.length + competition.oneDayBibStart;
            try{
                const newOneDayAth = await prisma.athlete.create({
                    data: {
                        ...oneDayAthData,
                        competition : {
                            connect : {
                                id : competition.id
                            }
                        },
                        bib : newBib,
                        license : newBib
                    }
                });
                res.send(newOneDayAth);
            } catch(e: any) {
                if (e.code === 'P2025') {
                    res.status(404).send('Wrong category id or event id');
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



