import { Router } from 'express';
import { prisma } from '@competition-manager/prisma';
import 'dotenv/config';
import { z } from 'zod';
import { parseRequest, checkRole, AuthenticatedRequest, Key } from '@competition-manager/utils';
import { Eid$, OneDayAthlete$, ONE_DAY_BIB, Role } from '@competition-manager/schemas';

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
    parseRequest(Key.Body, OneDayAthlete$),
    checkRole(Role.USER),
    async (req: AuthenticatedRequest, res) => {
        try{
            const { competitionEid } = Params$.parse(req.params);
            const { clubAbbr ,...oneDayAthData } = OneDayAthlete$.parse(req.body);
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
                        license : newBib
                    }
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
                }, Number(process.env.OneDayExpirationTime) || 24*60*60*1000);
                res.send(newOneDayAth);
            } catch(e: any) {
                if (e.code === 'P2025') {
                    res.status(404).send('Wrong club abbr');
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



