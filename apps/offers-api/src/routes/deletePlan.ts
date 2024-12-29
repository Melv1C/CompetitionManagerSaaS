import { prisma } from '@competition-manager/prisma';
import { PaymentPlan$ } from '@competition-manager/schemas';
import { Key, parseRequest } from '@competition-manager/utils';
import { Router } from 'express';

export const router = Router();

const Params$ = PaymentPlan$.pick({ id: true });

router.delete(
    '/plans/:id',
    parseRequest(Key.Params, Params$),
    async (req, res) => {
        const { id } = Params$.parse(req.params);
        await prisma.paymentPlan.delete({
            where: { id },
        });
        res.send({ id });
    }
)
