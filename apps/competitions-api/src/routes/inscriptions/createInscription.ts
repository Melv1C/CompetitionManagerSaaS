import { Router } from 'express';
import { parseRequest, AuthenticatedRequest, checkAdminRole, checkRole } from '@competition-manager/utils';
import { Competition$, BaseInscriptionWithRelationId$, BaseAdmin$, ListAthlete, listAthlete$ } from '@competition-manager/schemas';
import { z } from 'zod';
import { prisma } from '@competition-manager/prisma';

export const router = Router();

const findAthleteWithLicense = async (license: number, oneDayAthletes: ListAthlete) => {
    if (license <= 9999 && license >= 9900){
        return oneDayAthletes.find((a) => a.license === license);
    } else {
        return await prisma.athlete.findFirstOrThrow({
            where: {
                license: license,
                competitionId: null
            }
        });
    }
}




const Params$ = Competition$.pick({
    eid: true
});

const Query$ = z.object({
    admin: z.string()
});

const Body$ = z.array(BaseInscriptionWithRelationId$);

router.post(
    '/:eid/inscriptions',
    parseRequest('params', Params$),
    parseRequest('body', Body$),
    parseRequest('query', Query$),
    checkRole('user'),
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
                    oneDayAthletes: true,
                }
            });

            if (!competition) {
                res.status(404).send('Competition not found');
                return;
            }
            
            if (!admin){
                //TODO stripe
            }else{
                if (!checkAdminRole("inscriptions", req.user!.id, z.array(BaseAdmin$).parse(competition.admins), res)){
                    return;
                }
            }
            

            try {
                for (const inscription of Body$.parse(req.body)) {
                    const athlete = await findAthleteWithLicense(inscription.athleteLicense, listAthlete$.parse(competition.oneDayAthletes));


                    await prisma.inscription.create({
                        data: {
                            athlete: {
                                connect: {
                                    id : athlete!.id
                                }
                            },
                            competition: {
                                connect: {
                                    eid: eid
                                }
                            },
                            competitionEvent: {
                                connect: {
                                    eid: inscription.competitionEventEid
                                }
                            },
                            paid: inscription.paid,
                            confirmed: inscription.confirmed
                        }
                    })
                }
                res.status(201).send('Inscription(s) created');
            } catch(e: any) {
                if (e.code === 'P2025') {
                    res.status(404).send('Athlete license not valid');
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
