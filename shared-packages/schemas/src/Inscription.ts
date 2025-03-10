import z from 'zod';
import { Id$, Eid$, Price$, License$, Bib$, Date$ } from './Base';
import { AthleteWithoutClub$ } from './Athlete';
import { CompetitionEvent$, competitionEventInclude } from './CompetitionEvent';
import { BaseUser$ } from './User';
import { Club$ } from './Club';
import { Record$ } from './Records';

export enum InscriptionStatus {
    REGISTERED = 'registered',
    REFUSED = 'refused',
    PENDING = 'pending',
    ACCEPTED = 'accepted',
    CONFIRMED = 'confirmed',
    REMOVED = 'removed'
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

export const inscriptionsInclude = {
    athlete: true,
    competitionEvent: {
        include: competitionEventInclude
    },
    user: true,
    club: true,
    record: true,
};

export const CreateInscription$ = z.object({
    athleteLicense: License$,
    inscriptions: Inscription$.pick({
        record: true, 
    }).extend({
        competitionEventEid: Eid$
    }).array()
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

export const UpdateInscription$ = Inscription$.omit({
    id: true,
    eid: true,
    athlete: true,
    competitionEvent: true,
    user: true,
    club: true,
    bib: true,
    date: true,
});
export type UpdateInscription = z.infer<typeof UpdateInscription$>;


export const DisplayInscription$ = Inscription$.omit({
    user: true,
    paid: true,
});
export type DisplayInscription = z.infer<typeof DisplayInscription$>;