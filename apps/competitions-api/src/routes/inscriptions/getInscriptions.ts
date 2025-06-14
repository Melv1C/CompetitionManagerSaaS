import { Router } from 'express';
import { prisma } from '@competition-manager/prisma';
import { Access, AdminQuery$, BaseAdmin$, Competition$, DisplayInscription$, Inscription$, inscriptionsInclude, Role } from '@competition-manager/schemas';
import { CustomRequest, checkAdminRole, Key, parseRequest, setUserIfExist } from '@competition-manager/backend-utils';
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
    async (req: CustomRequest, res) => {
        try {
            const { eid } = Params$.parse(req.params);
            const { isAdmin } = AdminQuery$.parse(req.query);

            if (isAdmin && (!req.user || !isAuthorized(req.user, Role.ADMIN))) {
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
                if (!competition.admins.some(admin => admin.userId === req.user!.id)) {
                    res.status(401).send('Unauthorized');
                    return;
                }
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
                        include: inscriptionsInclude
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

            if (!competition.isInscriptionVisible) {
                res.send([]);
                return;
            }

            res.send(DisplayInscription$.array().parse(competition.inscriptions));
        } catch(error) {
            console.error(error);
            res.status(500).send(req.t('error.internalServerError'));
        }
    }
);