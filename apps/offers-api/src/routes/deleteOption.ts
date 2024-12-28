import { prisma } from '@competition-manager/prisma';
import { Option$ } from '@competition-manager/schemas';
import { Key, parseRequest } from '@competition-manager/utils';
import { Router } from 'express';

export const router = Router();

const Params$ = Option$.pick({ id: true });

router.delete(
    '/options/:id',
    parseRequest(Key.Params, Params$),
    async (req, res) => {
        const { id } = Params$.parse(req.params);
        await prisma.option.delete({
            where: { id },
        });
        res.send({ id });
    }
)


