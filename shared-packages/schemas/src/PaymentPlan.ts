import z from 'zod';

export const Option$ = z.object({
    id: z.number().positive(),
    name: z.string(),
    description: z.string(),
    price: z.number().positive(),
});
export type Option = z.infer<typeof Option$>;

export const PaymentPlan$ = z.object({
    id: z.number().positive(),
    name: z.string(),
    description: z.string(),
    includedOptions: z.array(Option$),
    price: z.number().positive(),
});
export type PaymentPlan = z.infer<typeof PaymentPlan$>;















