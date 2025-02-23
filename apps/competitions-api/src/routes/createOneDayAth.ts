/**
 * File: apps/competitions-api/src/routes/createOneDayAth.ts
 * 
 * This route handles the creation of one-day athletes for competitions.
 * One-day athletes are temporary participants who are not regular members.
 * They can be of three types:
 * - FOREIGN: Non-Belgian athletes with license and club in their country
 * - BPM: Athletes in BEN, PUP, or MIN categories
 * - ALL: Any participant
 */

import { Router } from 'express';
import { Prisma, prisma } from '@competition-manager/prisma';
import 'dotenv/config';
import { z } from 'zod';
import { parseRequest, checkRole, CustomRequest, Key, catchError } from '@competition-manager/backend-utils';
import { Eid$, CreateOneDayAthlete$, ONE_DAY_BIB, Role, athleteInclude, Athlete$ } from '@competition-manager/schemas';
import { env } from '../env';
import { logger } from '../logger';

export const router = Router();

/**
 * Calculates the next available one-day bib number
 * @param oneDayBib - Array of currently used one-day bib numbers
 * @param startBib - Starting bib number for the competition
 * @returns The next available bib number
 * @throws Error if no bib numbers are available
 */
const getNextBib = (oneDayBib: number[], startBib: number) => {
    // Iterate through possible bib numbers starting from competition's start bib
    for (let i = 0; i < ONE_DAY_BIB.NB; i++) {
        const bib = ONE_DAY_BIB.MIN + ((startBib - ONE_DAY_BIB.MIN + i) % (ONE_DAY_BIB.NB));
        if (!oneDayBib.includes(bib)) {
            return bib;
        }   
    }
    throw new Error('No bib available');
}

// Route parameters validation schema
const Params$ = z.object({
    competitionEid: Eid$
});

/**
 * POST /:competitionEid/oneDayAthlete
 * Creates a new one-day athlete for a specific competition
 * 
 * Required role: USER
 * 
 * Request parameters:
 * - competitionEid: External ID of the competition
 * 
 * Request body: CreateOneDayAthlete schema
 * - firstName: Athlete's first name
 * - lastName: Athlete's last name
 * - gender: Athlete's gender
 * - birthdate: Athlete's birthdate
 * - clubAbbr: Club abbreviation
 * 
 * Response:
 * - 200: Created athlete data
 * - 404: Competition not found or wrong club abbreviation
 * - 500: Internal server error
 */
router.post(
    '/:competitionEid/oneDayAthlete',
    parseRequest(Key.Params, Params$),
    parseRequest(Key.Body, CreateOneDayAthlete$),
    checkRole(Role.USER),
    async (req: CustomRequest, res) => {
        try{
            // Extract and validate parameters
            const { competitionEid } = Params$.parse(req.params);
            const { clubAbbr ,...oneDayAthData } = CreateOneDayAthlete$.parse(req.body);

            // Fetch competition with existing one-day athletes
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

            // Generate next available bib number
            const newBib = getNextBib(competition.oneDayAthletes.map(a => a.bib), competition.oneDayBibStart);

            try{
                // Create the one-day athlete
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
                        license : newBib.toString(), // Use bib as temporary license
                    },
                    include: athleteInclude
                });

                // Set up cleanup timeout for unused one-day athletes
                setTimeout(async () => {
                    //check if ath have inscriptions else delete it
                    const inscriptions = await prisma.inscription.findFirst({
                        where: {
                            athleteId: newOneDayAth.id
                        }
                    });
                    if(!inscriptions){
                        await prisma.athlete.delete({
                            where: {
                                id: newOneDayAth.id
                            }
                        });
                    }
                }, env.ONE_DAY_ATHLETE_TIMEOUT);

                logger.info(`One-day athlete created: ${newOneDayAth.id}`, {
                    path: 'POST /:competitionEid/oneDayAthlete',
                    status: 201,
                    userId: req.user?.id,
                    metadata: {
                        competitionEid,
                        athlete: Athlete$.parse(newOneDayAth)
                    }
                });

                res.status(201).send(Athlete$.parse(newOneDayAth));
            } catch(e) {
                if (e instanceof Prisma.PrismaClientKnownRequestError && e.code === 'P2025') {
                    catchError(logger)(e, {
                        message: 'Wrong club abbr',
                        path: 'POST /:competitionEid/oneDayAthlete',
                        status: 404,
                        userId: req.user?.id
                    });
                    res.status(404).send('Wrong club abbr');
                    return;
                } 
                throw e;
            }
        } catch (e) {
            catchError(logger)(e, {
                message: 'Internal server error',
                path: 'POST /:competitionEid/oneDayAthlete',
                status: 500,
                userId: req.user?.id
            });
            res.status(500).send(req.t('error.internalServerError'));
        }
    }
);



