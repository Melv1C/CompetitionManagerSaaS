import { z } from 'zod';
import { Eid$, Id$, License$ } from './Base';
import { Record$ } from './Records';

export enum WebhookType {
    INSCRIPTIONS = 'inscriptions',
}
export const WebhookType$ = z.nativeEnum(WebhookType);

export const StripeInscriptionMetadata$ = z.object({
    competitionEid: Eid$,
    userId: Id$,
    inscriptions: z.object({
        athlete: License$,
        event: Eid$,
        record: Record$.nullish()
    }).array(),
});
export type StripeInscriptionMetadata = z.infer<typeof StripeInscriptionMetadata$>;
