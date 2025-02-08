import { checkRole, Key, parseRequest } from '@competition-manager/backend-utils';
import { prisma } from '@competition-manager/prisma';
import { CreateNews$, News$, Role } from '@competition-manager/schemas';
import { Router } from 'express';

export const router = Router();

router.post(
    '/',
    parseRequest(Key.Body, CreateNews$),
    checkRole(Role.SUPERADMIN),
    async (req, res) => {
        // create news
        const news = CreateNews$.parse(req.body);
        const createdNews = await prisma.news.create({
            data: news
        });
        res.send(News$.parse(createdNews));
    }
);
