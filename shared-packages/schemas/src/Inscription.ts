import z from 'zod';
import { Id$, Eid$, Price$, License$, Bib$ } from './Base';
import { BaseAthlete$ } from './Athlete';
import { CompetitionEvent$ } from './CompetitionEvent';
import { BaseUser$ } from './User';
import { BaseClub$ } from './Club';
import { Record$ } from './Records';

export enum InscriptionStatus {
    REGISTERED = 'registered',
    REJECTED = 'rejected',
    PENDING = 'pending',
    ACCEPTED = 'accepted',
    CONFIRMED = 'confirmed',
    ABSENT = 'absent'
}

export const Inscription$ = z.object({
    id: Id$,
    eid: Eid$,
    athlete: BaseAthlete$,
    competitionEvent: CompetitionEvent$,
    paid: Price$.default(0),
    status: z.nativeEnum(InscriptionStatus).default(InscriptionStatus.ACCEPTED),
    user: BaseUser$,
    bib: Bib$,
    club: BaseClub$,
    record: Record$.nullish(),
    isDeleted: z.boolean().default(false),
});
export type Inscription = z.infer<typeof Inscription$>;

export const CreateInscription$ = Inscription$.pick({
    record: true,
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
    user: true,
    record: true,
    club: true,
    bib: true,
});
export type DefaultInscription = z.infer<typeof DefaultInscription$>;

export const DisplayInscription$ = Inscription$.omit({
    id: true,
    user: true,
    paid: true,
    isDeleted: true,
}).extend({
    isUser: z.boolean(),
});
export type DisplayInscription = z.infer<typeof DisplayInscription$>;
