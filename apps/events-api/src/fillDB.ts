import 'dotenv/config'
import { prisma } from '@competition-manager/prisma';
import { z } from 'zod';
import { Event$ } from '@competition-manager/schemas';
import eprData from './epreuves.json';

const EventWothoutId$ = Event$.omit({ id: true });

export const fillDB = async () => {
    const epreuves = await prisma.event.findMany();
    for (let epreuve of eprData) {
        try {
            EventWothoutId$.parse(epreuve);
        } catch (error) {
            console.log('Error parsing epreuve', epreuve);
            console.error(error);
            continue;
        }
        const found = epreuves.find(e => e.name === epreuve.name);
        if (found) {
            await prisma.event.update({
                where: { id: found.id },
                data: epreuve
            });
            continue;
        }
        await prisma.event.create({
            data: epreuve
        });
    }
    console.log('DB epreuves filled');
}







