import z from 'zod';
import { Athlete$, Competition$, CompetitionEvent$, Eid$, Id$, License$, Price$ } from '.';

export const Inscription$ = z.object({
    id: Id$,
    eid: Eid$,
    athlete: Athlete$,
    Competition: Competition$,
    CompetitionEvent$: CompetitionEvent$,
    paid: Price$.default(0),
    confirmed: z.boolean().default(false)
});
export type Inscription = z.infer<typeof Inscription$>;

export const BaseInscription$ = Inscription$.pick({
    paid: true,
    confirmed: true
});
export type BaseInscription = z.infer<typeof BaseInscription$>;

export const BaseInscriptionWithRelationId$ = BaseInscription$.extend({
    competitionEventEid: Eid$,
    athleteLicense: License$
});