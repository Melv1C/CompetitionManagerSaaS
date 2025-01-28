import { Router } from 'express';
import { prisma } from '@competition-manager/prisma';
import { Admin$, AdminQuery$, Competition$, DisplayInscription, DisplayInscription$, Inscription, Inscription$ } from '@competition-manager/schemas';
import { AuthenticatedRequest, Key, parseRequest, setUserIfExist } from '@competition-manager/backend-utils';

export const router = Router();

const setUserInscriptions = (userId: number|undefined, inscriptions: Inscription[]) => {
    const displayInscription: DisplayInscription[] = [];
    for (const inscription of inscriptions) {
        const { paid, ...inscriptionWithoutPaid } = inscription;
        displayInscription.push(
            DisplayInscription$.parse({
                ...inscriptionWithoutPaid,
                isUser: userId === inscription.user.id,
            })
        );
    }
    return displayInscription;
}

const Params$ = Competition$.pick({
    eid: true
});

router.get(
    '/:eid/inscriptions',
    parseRequest(Key.Params, Params$),
    setUserIfExist,
    async (req: AuthenticatedRequest, res) => {
        try {
            const { eid } = Params$.parse(req.params);
            const competition = await prisma.competition.findUnique({
                where: {
                    eid
                },
                include: {
                    inscriptions: {
                        where: {
                            isDeleted: false
                        },
                        include: {
                            user: true,
                            club: true,
                            competitionEvent: {
                                include: {
                                    event: true,
                                    categories: true
                                }
                            },
                            athlete: {
                                include: {
                                    club: true
                                }
                            },
                            record: true
                        }
                    }
                }
            });
            if (!competition) {
                res.status(404).send('Competition not found');
                return;
            }
            res.send(setUserInscriptions(req.user?.id, Inscription$.array().parse(competition.inscriptions)));
        } catch(error) {
            console.error(error);
            res.status(500).send('Internal server error');
        }
    }
);