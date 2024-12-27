import z from 'zod';
import { Id$, Name$, Price$ } from './Base';

export const Option$ = z.object({
    id: Id$,
    name: Name$,
    description: z.string(),
    price: Price$,
});
export type Option = z.infer<typeof Option$>;

export const OptionWithoutId$ = Option$.omit({ id: true });
export type OptionWithoutId = z.infer<typeof OptionWithoutId$>;

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















