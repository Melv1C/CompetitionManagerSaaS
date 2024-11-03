import { Router } from 'express';
import { z } from 'zod';

import { prisma } from '@competition-manager/prisma';
import { parseRequest } from '@competition-manager/utils';

import { Athlete, Athlete$ } from '@competition-manager/schemas';

export const router = Router();

const Query$ = z.object({
    key: z.string().min(1, {message: 'Key must be at least 1 characters long'})
});

const orderAthletes = async (athletes: Athlete[], key:string) => {
    const athletesWithBib = athletes.filter((athlete) => athlete.bib === parseInt(key));
    const athletesWithFirstName = athletes.filter((athlete) => athlete.firstName.toLowerCase().startsWith(key.toLowerCase()));
    const athletesWithLastName = athletes.filter((athlete) => athlete.lastName.toLowerCase().startsWith(key.toLowerCase()));
    const uniqueAthletes = new Set([...athletesWithBib, ...athletesWithFirstName, ...athletesWithLastName, ...athletes]);
    return Array.from(uniqueAthletes);
};

router.get(
    '',
    parseRequest('query', Query$), 
    async (req, res) => {
        const { key } = Query$.parse(req.query);
        const athletes = await prisma.athlete.findMany({
            where: {
                AND: [
                    { 
                        OR: [
                            { firstName: { contains: key, mode: 'insensitive' } },
                            { lastName: { contains: key, mode: 'insensitive' } },
                            { bib: !isNaN(parseInt(key)) ? parseInt(key) : undefined }
                        ]
                    },
                    { competitionId: null }
                ]
            }
        });
        if (!athletes.length) {
            res.status(404).send('No athlete found');
            return;
        }
        const sortedAthletes = await orderAthletes(athletes.map((athlete) => Athlete$.parse(athlete)), key);
        res.send(sortedAthletes);
    }
);
