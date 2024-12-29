import { prisma } from '@competition-manager/prisma';
import { Option$, OptionWithoutId$, Role } from '@competition-manager/schemas';
import { checkRole, Key, parseRequest } from '@competition-manager/utils';
import { Router } from 'express';

export const router = Router();

router.post(
    '/options',
    parseRequest(Key.Body, OptionWithoutId$),
    checkRole(Role.SUPERADMIN),
    async (req, res) => {
        const option = OptionWithoutId$.parse(req.body);
        const createdOption = await prisma.option.create({ data: option });
        res.json(Option$.parse(createdOption));
    }
)

