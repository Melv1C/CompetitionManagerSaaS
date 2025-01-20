import { Router } from 'express';
import { z } from 'zod';
import { prisma } from '@competition-manager/prisma';
import { Key, parseRequest } from '@competition-manager/backend-utils';
import { Athlete, Athlete$, AthleteKey$ } from '@competition-manager/schemas';

export const router = Router();

const orderAthletes = async (athletes: Athlete[], key:string) => {
    const athletesWithBib = athletes.filter((athlete) => athlete.bib === parseInt(key));
    const athletesWithFirstName = athletes.filter((athlete) => athlete.firstName.toLowerCase().startsWith(key.toLowerCase()));
    const athletesWithLastName = athletes.filter((athlete) => athlete.lastName.toLowerCase().startsWith(key.toLowerCase()));
    const uniqueAthletes = new Set([...athletesWithBib, ...athletesWithFirstName, ...athletesWithLastName, ...athletes]);
    return Array.from(uniqueAthletes);
};

const Query$ = z.object({
    key: AthleteKey$,
});

router.get(
    '/',
    parseRequest(Key.Query, Query$), 
    async (req, res) => {
        const { key } = Query$.parse(req.query);
        const keys = key.split(' ');

        const athletes = await prisma.athlete.findMany({
            where: {
                AND: [
                    {
                        AND: keys.map((k) => ({
                            OR: [
                                { firstName: { contains: k, mode: 'insensitive' } },
                                { lastName: { contains: k, mode: 'insensitive' } },
                                { bib: !isNaN(parseInt(k)) ? parseInt(k) : undefined }
                            ]
                        }))
                    },
                    { competitionId: null }
                ]
            },
            include: {
                club: true
            }
        });
        if (athletes.length == 0) {
            res.status(404).send('No athlete found');
            return;
        }
        const sortedAthletes = await orderAthletes(athletes.map((athlete) => Athlete$.parse(athlete)), key);
        res.send(Athlete$.array().parse(sortedAthletes));
    }
);
