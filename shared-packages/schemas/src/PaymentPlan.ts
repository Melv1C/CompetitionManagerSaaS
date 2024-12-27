import z from 'zod';
import { Id$, Name$, Price$ } from '.';

export const Option$ = z.object({
    id: Id$,
    name: Name$,
    description: z.string(),
    price: Price$,
});
export type Option = z.infer<typeof Option$>;

export const PaymentPlan$ = z.object({
    id: Id$,
    name: Name$,
    description: z.string(),
    includedOptions: z.array(Option$),
    price: Price$,
});
export type PaymentPlan = z.infer<typeof PaymentPlan$>;

export const CreatePaymentPlan$ = PaymentPlan$.omit({ id: true, includedOptions: true });
export type CreatePaymentPlan = z.infer<typeof CreatePaymentPlan$>;

export const UpdatePaymentPlan$ = PaymentPlan$.omit({ includedOptions: true }).extend({
    includedOptionsIds: z.array(Id$),
});















