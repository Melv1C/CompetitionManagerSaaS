import { z } from 'zod';
import { Id$, Name$, FutureDate$, Eid$ } from './Base';
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
    date: FutureDate$,

    // Other info
    description: z.string().default(''),
    events: z.array(CompetitionEvent$).default([]),
    publish: z.boolean().default(false),
    method: z.nativeEnum(PaymentMethod).default(PaymentMethod.FREE),
    paymentPlan: PaymentPlan$,
    options: z.array(Option$).default([]),
    startInscriptionDate: FutureDate$.optional(),
    endInscriptionDate: FutureDate$.optional(),

    // Default settings
    admins: z.array(Admin$),
    email: z.string().email(),

    // Advanced settings
    closeDate: FutureDate$.optional(),
    freeClubs: z.array(Club$).default([]),
    oneDayPermissions: z.array(z.nativeEnum(OneDayPermission)).default([]),
    oneDayBibStart: z.number().positive().max(9999).min(9900).default(9900),
        
});
export type Competition = z.infer<typeof Competition$>;

export const BaseCompetition$ = Competition$.pick({
    name: true,
    date: true,
    closeDate: true,
});
export type BaseCompetition = z.infer<typeof BaseCompetition$>;

export const BaseCompetitionWithRelationId$ = BaseCompetition$.extend({
    paymentPlanId: Id$,
    optionsId: z.array(Id$).default([]),
});
export type BaseCompetitionWithRelationId = z.infer<typeof BaseCompetitionWithRelationId$>;

export const DefaultCompetition$ = Competition$.omit({
    id: true,
    eid: true,
    paymentPlan: true,
    options: true,
    admins: true,
    email: true,

    //Without relation
    events: true,
    freeClubs: true,
});
export type DefaultCompetition = z.infer<typeof DefaultCompetition$>;



export const UpdateCompetition$ = Competition$.pick({
    name: true,
    date: true,
    description: true,
    publish: true,
    method: true,
    startInscriptionDate: true,
    endInscriptionDate: true,
    email: true,
    closeDate: true,
    oneDayPermissions: true,
    oneDayBibStart: true,
});
export type UpdateCompetition = z.infer<typeof UpdateCompetition$>;

export const UpdateCompetitionWithRelationId$ = UpdateCompetition$.extend({
    paymentPlanId: Id$,
    optionsId: z.array(Id$).default([]),
    freeClubsId: z.array(Id$).default([]),
});
export type UpdateCompetitionWithRelationId = z.infer<typeof UpdateCompetitionWithRelationId$>;

export const DisplayCompetition$ = Competition$.pick({
    eid: true,
    name: true,
    date: true,
});
export type DisplayCompetition = z.infer<typeof DisplayCompetition$>;

export const AdminCompetition$ = Competition$.omit({
    id: true,
})