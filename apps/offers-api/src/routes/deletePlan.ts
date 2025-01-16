import { prisma } from '@competition-manager/prisma';
import { PaymentPlan$, Role } from '@competition-manager/schemas';
import { checkRole, Key, parseRequest } from '@competition-manager/backend-utils';
import { Router } from 'express';

export const router = Router();

const Params$ = PaymentPlan$.pick({ id: true });

router.delete(
    '/plans/:id',
    parseRequest(Key.Params, Params$),
    checkRole(Role.SUPERADMIN),
    async (req, res) => {
        const { id } = Params$.parse(req.params);
        await prisma.paymentPlan.delete({
            where: { id },
        });
        res.send({ id });
    }
)

