import { Email } from '@competition-manager/schemas';
import Stripe from 'stripe';

import { z } from 'zod';

const env$ = z.object({
    STRIPE_SECRET_KEY: z.string().startsWith('sk')
});

const env = env$.parse(process.env);

const stripe = new Stripe(env.STRIPE_SECRET_KEY);

export const createCheckoutSession = async (
    line_items: Stripe.Checkout.SessionCreateParams.LineItem[],
    success_url: string,
    cancel_url: string,
    customer_email: Email,
    couponValue: number,
    metadata?: Stripe.MetadataParam
) => {

    const coupon = couponValue > 0 ? await stripe.coupons.create({
        amount_off: couponValue,
        currency: 'eur',
        duration: 'once',
        name: 'Alredy paid', //TODO: Translate
    }) : undefined;

    const session = await stripe.checkout.sessions.create({
        payment_method_types: ['card', 'bancontact'],
        customer_email: customer_email,
        line_items: line_items,
        discounts: coupon ? [{coupon: coupon.id}] : undefined,
        mode: 'payment',
        success_url: success_url,
        cancel_url: cancel_url,
        metadata: metadata,
    });
    return session;
}

