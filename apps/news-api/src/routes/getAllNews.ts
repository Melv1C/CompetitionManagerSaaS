import { AuthentificatedRequest, Key, parseRequest, setUserIfExist } from '@competition-manager/backend-utils';
import { prisma } from '@competition-manager/prisma';
import { AdminQuery$, Language, News$, Role } from '@competition-manager/schemas';
import { Router } from 'express';
import { isAuthorized } from '../../../../shared-packages/utils/src';

export const router = Router();

router.get(
    '/',
    parseRequest(Key.Query, AdminQuery$),
    setUserIfExist,
    async (req: AuthentificatedRequest, res) => {
        const { isAdmin } = AdminQuery$.parse(req.query);
        if (isAdmin && !isAuthorized(req.user!, Role.SUPERADMIN)) {
            res.status(401).send('Unauthorized');
            return;
        }

        const lng = req.headers['accept-language'] || Language.EN;

        const news = await prisma.news.findMany({
            where: {
                language: isAdmin ? undefined : lng
            },
            orderBy: {
                createdAt: 'desc'
            }
        });

        res.send(News$.array().parse(news));
    }
);