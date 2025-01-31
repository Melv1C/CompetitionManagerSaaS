import { prisma } from "@competition-manager/prisma";
import { Athlete, CreateInscription, DefaultInscription$, Eid, Id, Inscription } from "@competition-manager/schemas";
import z from "zod";

const Meta$ = DefaultInscription$.pick({status: true, paid: true});
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
) => {
    for (const inscriptionData of inscriptionsData) {
        // Get all inscriptions for the athlete
        const existingInscriptions = inscriptions.filter(i => i.athlete.license === inscriptionData.athlete.license);
        
        const toDeleteInscriptions = existingInscriptions.filter(i => !inscriptionData.inscriptions.some(newI => newI.data.competitionEventEid === i.competitionEvent.eid));
        const toUpdateInscriptions = existingInscriptions.filter(i => inscriptionData.inscriptions.some(newI => newI.data.competitionEventEid === i.competitionEvent.eid));
        const newInscriptions = inscriptionData.inscriptions.filter(newI => !existingInscriptions.some(i => newI.data.competitionEventEid === i.competitionEvent.eid));

        // Delete inscriptions (put isDeleted to true)
        for (const inscription of toDeleteInscriptions) {
            await prisma.inscription.update({
                where: {
                    id: inscription.id
                },
                data: {
                    isDeleted: true
                }
            });
        }

        // Update inscriptions
        for (const inscription of toUpdateInscriptions) {
            const { data, meta } = inscriptionData.inscriptions.find(i => i.data.competitionEventEid === inscription.competitionEvent.eid)!;
            const defaultInscriptionData = DefaultInscription$.omit({date: true}).parse(Meta$.parse(meta));
            const record = data.record ?? undefined;
            await prisma.inscription.update({
                where: {
                    id: inscription.id
                },
                data: {
                    user: {
                        connect: {
                            id: inscriptionData.userId
                        }
                    },
                    record: {
                        update: record
                    },
                    ...defaultInscriptionData
                }
            });
        }

        // Create inscriptions
        for (const { data, meta } of newInscriptions) {
            const defaultInscriptionData = DefaultInscription$.parse(Meta$.parse(meta));
            const record = data.record ?? undefined;
            await prisma.inscription.create({
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
                }
            });
        }
    }
}
