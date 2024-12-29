import { prisma } from '@competition-manager/prisma';
import { Option$, OptionWithoutId$, Role } from '@competition-manager/schemas';
import { checkRole, Key, parseRequest } from '@competition-manager/utils';
import { Router } from 'express';

export const router = Router();

const Params$ = Option$.pick({ id: true });

router.put(
    '/options/:id',
    parseRequest(Key.Params, Params$),
    parseRequest(Key.Body, OptionWithoutId$),
    checkRole(Role.SUPERADMIN),
    async (req, res) => {
        const { id } = Params$.parse(req.params);
        const data = OptionWithoutId$.parse(req.body);
        const updatedOption = await prisma.option.update({
            where: { id },
            data,
        });
        res.send(Option$.parse(updatedOption));
    }
)

