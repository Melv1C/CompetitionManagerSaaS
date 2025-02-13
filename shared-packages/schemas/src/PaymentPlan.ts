import z from 'zod';
import { Id$, Name$, Price$ } from './Base';

export const Option$ = z.object({
    id: Id$,
    name: Name$,
    description: z.string(),
    price: Price$,
});
export type Option = z.infer<typeof Option$>;

export const CreateOption$ = Option$.omit({ id: true });
export type CreateOption = z.infer<typeof CreateOption$>;

export const UpdateOption$ = CreateOption$
export type UpdateOption = z.infer<typeof UpdateOption$>;

export const PaymentPlan$ = z.object({
    id: Id$,
    name: Name$,
    description: z.string(),
    includedOptions: z.array(Option$).default([]),
    price: Price$,
});
export type PaymentPlan = z.infer<typeof PaymentPlan$>;

export const CreatePaymentPlan$ = PaymentPlan$.omit({ id: true, includedOptions: true });
export type CreatePaymentPlan = z.infer<typeof CreatePaymentPlan$>;

export const UpdatePaymentPlan$ = CreatePaymentPlan$.extend({
    includedOptionsIds: z.array(Id$),
});
export type UpdatePaymentPlan = z.infer<typeof UpdatePaymentPlan$>;