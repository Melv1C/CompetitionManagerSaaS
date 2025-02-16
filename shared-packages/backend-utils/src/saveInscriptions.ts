import { prisma } from "@competition-manager/prisma";
import { Athlete, CompetitionEvent, CreateInscription, DefaultInscription$, Eid, Id, Inscription, Inscription$, inscriptionsInclude } from "@competition-manager/schemas";
import z from "zod";

const Meta$ = DefaultInscription$.pick({status: true});
type Meta = z.infer<typeof Meta$>;

export const saveInscriptions = async (
    competitionEid: Eid,
    inscriptionsData: {
        userId: Id,
        athlete: Athlete;
        inscriptions: {
            data: CreateInscription["inscriptions"][0];
            meta: Meta;
        }[];
    }[],
    inscriptions: Inscription[],
    totalPaid: number,
    competitionEvents: CompetitionEvent[],
) => {

    const returnValue: { deletedInscriptions: Inscription[], updatedInscriptions: Inscription[], createdInscriptions: Inscription[] } = {
        deletedInscriptions: [],
        updatedInscriptions: [],
        createdInscriptions: []
    };

    for (const inscriptionData of inscriptionsData) {
        // Get all inscriptions for the athlete
        const existingInscriptions = inscriptions.filter(i => i.athlete.license === inscriptionData.athlete.license);
        const toDeleteInscriptions = existingInscriptions.filter(i => !inscriptionData.inscriptions.some(newI => newI.data.competitionEventEid === i.competitionEvent.eid));
        const toUpdateInscriptions = existingInscriptions.filter(i => inscriptionData.inscriptions.some(newI => newI.data.competitionEventEid === i.competitionEvent.eid));
        const newInscriptions = inscriptionData.inscriptions.filter(newI => !existingInscriptions.some(i => newI.data.competitionEventEid === i.competitionEvent.eid));

        // Update inscriptions
        for (const inscription of toUpdateInscriptions) {
            const { data, meta } = inscriptionData.inscriptions.find(i => i.data.competitionEventEid === inscription.competitionEvent.eid)!;
            const record = data.record ?? undefined;

            const event = competitionEvents.find(e => e.eid === data.competitionEventEid);
            if (!event) throw new Error('Event not found');
            
            const updatedInscription = await prisma.inscription.update({
                where: {
                    id: inscription.id
                },
                data: {
                    record: {
                        update: record
                    },
                    paid: Math.min(totalPaid, event.cost),
                    ...meta
                },
                include: inscriptionsInclude
            });

            totalPaid -= Math.min(totalPaid, event.cost);

            returnValue.updatedInscriptions.push(Inscription$.parse(updatedInscription));
        }

        // Create inscriptions
        for (const { data, meta } of newInscriptions) {
            const defaultInscriptionData = DefaultInscription$.parse(Meta$.parse(meta));
            const record = data.record ?? undefined;

            const event = competitionEvents.find(e => e.eid === data.competitionEventEid);
            if (!event) throw new Error('Event not found');

            defaultInscriptionData.paid = Math.min(totalPaid, event.cost);

            const createdInscription = await prisma.inscription.create({
                data: {
                    competition: {
                        connect: {
                            eid: competitionEid
                        }
                    },
                    user: {
                        connect: {
                            id: inscriptionData.userId
                        }
                    },
                    athlete: {
                        connect: {
                            id: inscriptionData.athlete.id
                        }
                    },
                    competitionEvent: {
                        connect: {
                            eid: data.competitionEventEid
                        }
                    },
                    bib: inscriptionData.athlete.bib,
                    club: {
                        connect: {
                            id: inscriptionData.athlete.club.id
                        }
                    },
                    record: {
                        create: record
                    },
                    ...defaultInscriptionData
                },
                include: inscriptionsInclude
            });

            totalPaid -= Math.min(totalPaid, event.cost);

            returnValue.createdInscriptions.push(Inscription$.parse(createdInscription));
        }

        // Delete inscriptions (put isDeleted to true)
        for (const inscription of toDeleteInscriptions) {

            const event = competitionEvents.find(e => e.eid === inscription.competitionEvent.eid);
            if (!event) throw new Error('Event not found');

            const paid = Math.min(totalPaid, event.cost);

            const deletedInscription = await prisma.inscription.update({
                where: {
                    id: inscription.id
                },
                data: {
                    isDeleted: true,
                    paid: paid,
                },
                include: inscriptionsInclude
            });

            totalPaid -= paid;

            returnValue.deletedInscriptions.push(Inscription$.parse(deletedInscription));
        }
    }

    return returnValue;
}
