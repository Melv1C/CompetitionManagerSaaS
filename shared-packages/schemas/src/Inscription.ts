import z from 'zod';
import { Athlete$ } from './Athlete';
import { Competition$ } from './Competition';
import { CompetitionEvent$ } from './CompetitionEvent';
import { Eid$ } from './Eid';

export const Inscription$ = z.object({
    id: z.number(),
    eid: z.string(),
    athlete: Athlete$,
    Competition: Competition$,
    CompetitionEvent$: CompetitionEvent$,
    paid: z.number().default(0),
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
    athleteLicense: z.string()
});