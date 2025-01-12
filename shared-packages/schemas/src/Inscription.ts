import z from 'zod';
import { Id$, Eid$, Price$, License$ } from './Base';
import { Athlete$ } from './Athlete';
import { Competition$ } from './Competition';
import { CompetitionEvent$ } from './CompetitionEvent';

export const Inscription$ = z.object({
    id: Id$,
    eid: Eid$,
    athlete: Athlete$,
    competitionEvent: CompetitionEvent$,
    paid: Price$.default(0),
    isConfirmed: z.boolean().default(false),
    isDeleted: z.boolean().default(false),
    isAbsent: z.boolean().default(false),
});
export type Inscription = z.infer<typeof Inscription$>;

export const CreateInscription$ = Inscription$.pick({
    //TODO pick record, ...
}).extend({
    competitionEventEid: Eid$,
    athleteLicense: License$
});
export type CreateInscription = z.infer<typeof CreateInscription$>;

export const DefaultInscription$ = Inscription$.omit({
    id: true,
    eid: true,
    athlete: true,
    competitionEvent: true,
});

export type DefaultInscription = z.infer<typeof DefaultInscription$>;