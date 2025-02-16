import { z } from 'zod';
import { Eid$, Id$, License$ } from './Base';
import { Record$ } from './Records';
import { Language } from './UserPreferences';

export enum WebhookType {
    INSCRIPTIONS = 'inscriptions',
}
export const WebhookType$ = z.nativeEnum(WebhookType);

export const StripeInscriptionMetadata$ = z.object({
    competitionEid: Eid$,
    userId: Id$,
    lng: z.nativeEnum(Language).default(Language.EN),
    inscriptions: z.object({
        athlete: License$,
        event: Eid$,
        record: Record$.nullish()
    }).array(),
});
export type StripeInscriptionMetadata = z.infer<typeof StripeInscriptionMetadata$>;
