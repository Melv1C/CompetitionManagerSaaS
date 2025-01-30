import { Router } from 'express';
import { prisma } from '@competition-manager/prisma';
import { Access, AdminQuery$, BaseAdmin$, Competition$, DisplayInscription$, Inscription$, Role } from '@competition-manager/schemas';
import { AuthenticatedRequest, checkAdminRole, Key, parseRequest, setUserIfExist } from '@competition-manager/backend-utils';
import { isAuthorized } from '@competition-manager/utils';


export const router = Router();

const Params$ = Competition$.pick({
    eid: true
});

router.get(
    '/:eid/inscriptions',
    parseRequest(Key.Params, Params$),
    parseRequest(Key.Query, AdminQuery$),
    setUserIfExist,
    async (req: AuthenticatedRequest, res) => {
        try {
            const { eid } = Params$.parse(req.params);
            const { isAdmin } = AdminQuery$.parse(req.query);

            if (isAdmin && !req.user) {
                res.status(401).send('Unauthorized');
                return;
            }
            if (isAdmin && !isAuthorized(req.user!, Role.SUPERADMIN) && !isAuthorized(req.user!, Role.ADMIN)) {
                res.status(401).send('Unauthorized');
                return;
            }

            if (isAdmin && !isAuthorized(req.user!, Role.SUPERADMIN)) {
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
                if (!checkAdminRole(Access.INSCRIPTIONS, req.user!.id, BaseAdmin$.array().parse(competition.admins), res)) return;
            }

            const competition = await prisma.competition.findUnique({
                where: {
                    eid
                },
                include: {
                    inscriptions: {
                        where: {
                            ...(isAdmin ? {} : { isDeleted: false })
                        },
                        include: {
                            user: true,
                            athlete: true,
                            club: true,
                            competitionEvent: {
                                include: {
                                    event: true,
                                    categories: true
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

            if (isAdmin) {
                res.send(Inscription$.array().parse(competition.inscriptions));
                return;
            }

            res.send(DisplayInscription$.array().parse(competition.inscriptions));
        } catch(error) {
            console.error(error);
            res.status(500).send('Internal server error');
        }
    }
);