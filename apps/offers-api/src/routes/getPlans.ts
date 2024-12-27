import { prisma } from '@competition-manager/prisma';
import { PaymentPlan$ } from '@competition-manager/schemas';
import { Router } from 'express';

export const router = Router();

router.get(
    '/plans',
    async (req, res) => {
        const plans = await prisma.paymentPlan.findMany({
            include: {
                includedOptions: true
            }
        });
        res.send(PaymentPlan$.array().parse(plans));
    }
)

