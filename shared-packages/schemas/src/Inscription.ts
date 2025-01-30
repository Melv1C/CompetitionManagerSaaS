import z from 'zod';
import { Id$, Eid$, Price$, License$, Bib$, Date$ } from './Base';
import { AthleteWithoutClub$ } from './Athlete';
import { CompetitionEvent$ } from './CompetitionEvent';
import { BaseUser$ } from './User';
import { Club$ } from './Club';
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
    athlete: AthleteWithoutClub$,
    competitionEvent: CompetitionEvent$,
    paid: Price$.default(0),
    status: z.nativeEnum(InscriptionStatus).default(InscriptionStatus.ACCEPTED),
    user: BaseUser$,
    bib: Bib$,
    club: Club$,
    record: Record$.nullish(),
    isDeleted: z.boolean().default(false),
    date: Date$.default(() => new Date()),
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
    user: true,
    paid: true,
});
export type DisplayInscription = z.infer<typeof DisplayInscription$>;