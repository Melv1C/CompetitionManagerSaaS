import { z } from 'zod';
import { Id$, Name$, Eid$, Email$, Date$ } from './Base';
import { CompetitionEvent$ } from './CompetitionEvent';
import { PaymentPlan$, Option$ } from './PaymentPlan';
import { Admin$ } from './Admin';
import { Club$ } from './Club';

export enum PaymentMethod {
    FREE = 'free',
    ONLINE = 'online',
    ONPLACE = 'onPlace',
}

export enum OneDayPermission {
    FOREING = 'foreing',
    ALL = 'all',
    BPM = 'bpm',
}

export const Competition$ = z.object({
    id: Id$,
    eid: Eid$,

    // Basic info
    name: Name$,
    date: Date$,

    // Other info
    description: z.string().default(''),
    events: z.array(CompetitionEvent$).default([]),
    publish: z.boolean().default(false),
    method: z.nativeEnum(PaymentMethod).default(PaymentMethod.FREE),
    paymentPlan: PaymentPlan$,
    options: z.array(Option$).default([]),
    startInscriptionDate: Date$.default(new Date()),
    endInscriptionDate: Date$.default(new Date()),

    // Default settings
    admins: z.array(Admin$),
    email: Email$,
    club: Club$.nullish(),
    isDeleted: z.boolean().default(false),

    // Advanced settings
    closeDate: Date$.nullish(),
    freeClubs: z.array(Club$).default([]),
    oneDayPermissions: z.array(z.nativeEnum(OneDayPermission)).default([]),
    oneDayBibStart: z.number().positive().max(9999).min(9900).default(9900),
        
});
export type Competition = z.infer<typeof Competition$>;

export const CreateCompetition$ = Competition$.pick({
    name: true,
    date: true,
    closeDate: true,
}).extend({
    paymentPlanId: Id$,
    optionsId: z.array(Id$).default([]),
});
export type CreateCompetition = z.infer<typeof CreateCompetition$>;

export const DefaultCompetition$ = Competition$.omit({
    id: true,
    eid: true,
    paymentPlan: true,
    options: true,
    admins: true,
    email: true,
    events: true,
    freeClubs: true,
    club: true,
});
export type DefaultCompetition = z.infer<typeof DefaultCompetition$>;

export const UpdateCompetition$ = Competition$.omit({
    id: true,
    eid: true,
    paymentPlan: true,
    options: true,
    admins: true,
    freeClubs: true,
    events: true,
    club: true,
    isDeleted: true,
}).extend({
    optionsId: z.array(Id$).default([]),
    freeClubsId: z.array(Id$).default([]),
});
export type UpdateCompetition = z.infer<typeof UpdateCompetition$>;

export const DisplayCompetition$ = Competition$.pick({
    eid: true,
    name: true,
    date: true,
});
export type DisplayCompetition = z.infer<typeof DisplayCompetition$>;