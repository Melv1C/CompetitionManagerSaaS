import { prisma } from '@competition-manager/prisma';
import { CreatePaymentPlan$ } from '@competition-manager/schemas';
import { Key, parseRequest } from '@competition-manager/utils';
import { Router } from 'express';

export const router = Router();

router.post(
    '/plans',
    parseRequest(Key.Body, CreatePaymentPlan$),
    async (req, res) => {
        const plan = CreatePaymentPlan$.parse(req.body);
        const createdPlan = await prisma.paymentPlan.create({ data: plan });
        res.json(createdPlan);
    }
)

