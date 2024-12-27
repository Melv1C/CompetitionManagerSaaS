import z from 'zod';
import { Id$, Eid$, Price$, License$ } from './Base';
import { Athlete$ } from './Athlete';
import { Competition$ } from './Competition';
import { CompetitionEvent$ } from './CompetitionEvent';


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