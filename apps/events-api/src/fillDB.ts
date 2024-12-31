import 'dotenv/config'
import { prisma } from '@competition-manager/prisma';
import { CreateEvent$ } from '@competition-manager/schemas';
import eprData from './epreuves.json';

export const fillDB = async () => {
    const events = await prisma.event.findMany();
    for (let eventData of eprData) {
        try {
            const event = CreateEvent$.parse(eventData);
            const existingEvent = events.find(e => e.name === event.name);
            if (existingEvent) {
                await prisma.event.update({
                    where: { id: existingEvent.id },
                    data: event
                });
                continue;
            }
            await prisma.event.create({
                data: event
            });
        } catch (error) {
            console.log('Error parsing event', eventData);
            console.error(error);
            continue;
        }
    }
    console.log('DB events filled');
}
