import { Router } from 'express';
import { prisma } from '@competition-manager/prisma';
import 'dotenv/config';
import { z } from 'zod';
import { parseRequest, checkRole, CustomRequest, Key } from '@competition-manager/backend-utils';
import { Eid$, CreateOneDayAthlete$, ONE_DAY_BIB, Role, athleteInclude, Athlete$ } from '@competition-manager/schemas';
import { env } from '../env';

export const router = Router();

const getNextBib = (oneDayBib: number[], startBib: number) => {
    for (let i = 0; i < ONE_DAY_BIB.NB; i++) {
        const bib = ONE_DAY_BIB.MIN + ((startBib - ONE_DAY_BIB.MIN + i) % (ONE_DAY_BIB.NB));
        if (!oneDayBib.includes(bib)) {
            return bib;
        }   
    }
    throw new Error('No bib available');
}

const Params$ = z.object({
    competitionEid: Eid$
});

router.post(
    '/:competitionEid/oneDayAthlete',
    parseRequest(Key.Params, Params$),
    parseRequest(Key.Body, CreateOneDayAthlete$),
    checkRole(Role.USER),
    async (req: CustomRequest, res) => {
        try{
            const { competitionEid } = Params$.parse(req.params);
            const { clubAbbr ,...oneDayAthData } = CreateOneDayAthlete$.parse(req.body);
            const competition = await prisma.competition.findUnique({
                where: {
                    eid: competitionEid
                },
                include: {
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
            const newBib = getNextBib(competition.oneDayAthletes.map(a => a.bib), competition.oneDayBibStart);
            try{
                const newOneDayAth = await prisma.athlete.create({
                    data: {
                        ...oneDayAthData,
                        competition : {
                            connect : {
                                id : competition.id
                            }
                        },
                        club : {
                            connect : {
                                abbr : clubAbbr
                            }
                        },
                        bib : newBib,
                        license : newBib.toString(),
                    },
                    include: athleteInclude
                });
                setTimeout(async () => {
                    //check if ath have inscriptions else delete it
                    const inscriptions = await prisma.inscription.findFirst({
                        where: {
                            athleteId: newOneDayAth.id
                        }
                    });
                    if(inscriptions){
                        await prisma.athlete.delete({
                            where: {
                                id: newOneDayAth.id
                            }
                        });
                    }
                }, env.ONE_DAY_ATHLETE_TIMEOUT);
                res.send(Athlete$.parse(newOneDayAth));
            } catch(e: any) {
                if (e.code === 'P2025') {
                    res.status(404).send('Wrong club abbr');
                    return;
                } else{
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



