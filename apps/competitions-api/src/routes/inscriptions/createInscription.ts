import { Router } from 'express';
import { parseRequest, AuthenticatedRequest, checkAdminRole } from '@competition-manager/utils';
import { Competition$, BaseInscriptionWithRelationId$, BaseAdmin$ } from '@competition-manager/schemas';
import { z } from 'zod';
import { prisma } from '@competition-manager/prisma';

export const router = Router();

const Params$ = Competition$.pick({
    eid: true
});

const Query$ = z.object({
    admin: z.boolean().default(false)
});

const Body$ = z.array(BaseInscriptionWithRelationId$);

router.post(
    '/:competitionEid/inscriptions',
    parseRequest('params', Params$),
    parseRequest('body', Body$),
    parseRequest('query', Query$),
    async (req: AuthenticatedRequest, res) => {
        try {
            const { admin } = Query$.parse(req.query);
            const { eid } = Params$.parse(req.params);

            const competition = await prisma.competition.findUnique({
                where: {
                    eid
                },
                include: {
                    admins: true
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
                    prisma.inscription.create({
                        data: {
                            athlete: {
                                connect: {
                                    license: inscription.athleteLicense
                                }
                            },
                            competition: {
                                connect: {
                                    eid: eid
                                }
                            },
                            competitionEvent: {
                                connect: {
                                    id: inscription.competitionEventId
                                }
                            },
                            paid: inscription.paid,
                            confirmed: inscription.confirmed
                        }
                    })
                }
            } catch(e: any) {
                if (e.code === 'P2025') {
                    res.status(404).send('i');
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
