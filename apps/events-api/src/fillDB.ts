import 'dotenv/config'
import { prisma } from '@competition-manager/prisma';
import { z } from 'zod';
import { Event$ } from '@competition-manager/schemas';
import eprData from './epreuves.json';

const EventWothoutId$ = Event$.omit({ id: true });

export const fillDB = async () => {
    const events = await prisma.event.findMany();
    for (let event of eprData) {
        try {
            EventWothoutId$.parse(event);
        } catch (error) {
            console.log('Error parsing event', event);
            console.error(error);
            continue;
        }
        const found = events.find(e => e.name === event.name);
        if (found) {
            await prisma.event.update({
                where: { id: found.id },
                data: event
            });
            continue;
        }
        await prisma.event.create({
            data: event
        });
    }
    console.log('DB events filled');
}







