import { prisma } from '@competition-manager/prisma';
import { Option$, CreateOption$, Role } from '@competition-manager/schemas';
import { checkRole, Key, parseRequest } from '@competition-manager/backend-utils';
import { Router } from 'express';

export const router = Router();

router.post(
    '/options',
    parseRequest(Key.Body, CreateOption$),
    checkRole(Role.SUPERADMIN),
    async (req, res) => {
        const option = CreateOption$.parse(req.body);
        const createdOption = await prisma.option.create({ data: option });
        res.json(Option$.parse(createdOption));
    }
)

