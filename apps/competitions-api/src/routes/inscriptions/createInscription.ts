import { Router } from 'express';
import { parseRequest, AuthenticatedRequest, checkAdminRole, checkRole, Key } from '@competition-manager/utils';
import { Competition$, CreateInscription$, DefaultInscription$, BaseAdmin$, Athlete, Athlete$, Access, Role, Inscription$, License } from '@competition-manager/schemas';
import { z } from 'zod';
import { prisma } from '@competition-manager/prisma';

export const router = Router();

const findAthleteWithLicense = async (license: License, oneDayAthletes: Athlete[] = []) => {
    return oneDayAthletes.find((a) => a.license === license) || Athlete$.parse(await prisma.athlete.findFirstOrThrow({
        where: {
            license: license,
            competitionId: null
        }
    }));
}
const Params$ = Competition$.pick({
    eid: true
});

const Query$ = z.object({
    admin: z.string()
});

router.post(
    '/:eid/inscriptions',
    parseRequest(Key.Params, Params$),
    parseRequest(Key.Body, z.array(CreateInscription$)),
    parseRequest(Key.Query, Query$),
    checkRole(Role.USER),
    async (req: AuthenticatedRequest, res) => {
        try {
            //TODO check place 
            //TODO check if the event is open
            //TODO check if the athlete is in the right category
            const { admin } = Query$.parse(req.query);
            const { eid } = Params$.parse(req.params);

            const competition = await prisma.competition.findUnique({
                where: {
                    eid
                },
                include: {
                    admins: true,
                    oneDayAthletes: true
                }
            });

            if (!competition) {
                res.status(404).send('Competition not found');
                return;
            }
            
            if (!admin){
                //TODO stripe
            } else{
                if (!checkAdminRole(Access.INSCRIPTIONS, req.user!.id, z.array(BaseAdmin$).parse(competition.admins), res)){
                    return;
                }
            }

            try {
                const listInscriptions = [];
                for (const { athleteLicense, competitionEventEid, ...inscription } of DefaultInscription$.array().parse(req.body)) {
                    const athlete = await findAthleteWithLicense(athleteLicense, z.array(Athlete$).parse(competition.oneDayAthletes));
                    const newInscription = await prisma.inscription.create({
                        data: {
                            athlete: {
                                connect: {
                                    id : athlete.id
                                }
                            },
                            competition: {
                                connect: {
                                    eid: eid
                                }
                            },
                            competitionEvent: {
                                connect: {
                                    eid: competitionEventEid
                                }
                            },
                            ...inscription
                        }
                    })
                    listInscriptions.push(newInscription);
                }
                res.status(201).send(Inscription$.array().parse(listInscriptions));
            } catch(e: any) {
                if (e.code === 'P2025') {
                    res.status(404).send('Athlete license not valid');
                    return;
                } else{
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
