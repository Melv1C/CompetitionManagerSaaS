import { prisma } from '@competition-manager/prisma';
import { PaymentPlan$, Role, UpdatePaymentPlan$ } from '@competition-manager/schemas';
import { checkRole, Key, parseRequest } from '@competition-manager/utils';
import { Router } from 'express';

export const router = Router();

const Params$ = PaymentPlan$.pick({ id: true });

router.put(
    '/plans/:id',
    parseRequest(Key.Params, Params$),
    parseRequest(Key.Body, UpdatePaymentPlan$),
    checkRole(Role.SUPERADMIN),
    async (req, res) => {
        const { id } = Params$.parse(req.params);
        const { includedOptionsIds, ...data } = UpdatePaymentPlan$.parse(req.body);
        const includedOptions = includedOptionsIds.map((id) => ({ id }));
        const updatedPlan = await prisma.paymentPlan.update({
            where: { id },
            data: {
                ...data,
                includedOptions: {
                    set: includedOptions,
                },
            },
            include: {
                includedOptions: true,
            },
        });
        res.send(PaymentPlan$.parse(updatedPlan));
    }
)

