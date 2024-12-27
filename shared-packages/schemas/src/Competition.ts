import { z } from 'zod';
import { CompetitionEvent$ } from './CompetitionEvent';
import { Admin$ } from './Admin';
import { Club$ } from './Club';
import { Option$, PaymentPlan$ } from './PaymentPlan';


export enum PAYMENT_METHOD {
    FREE = 'free',
    ONLINE = 'online',
    ONPLACE = 'onPlace',
}

export enum ONE_DAY_PERMISSION {
    FOREING = 'foreing',
    ALL = 'all',
    BPM = 'bpm',
}

export const Competition$ = z.object({
    id: z.number().positive(),
    eid: z.string().min(1),

    // Basic info
    name: z.string().min(1),
    date: z.coerce.date().min(new Date()),  //test if .min(new Date() works

    // Other info
    description: z.string().default(''),
    events: z.array(CompetitionEvent$).default([]),
    publish: z.boolean().default(false),
    method: z.nativeEnum(PAYMENT_METHOD).default(PAYMENT_METHOD.FREE),
    paymentPlan: PaymentPlan$,
    options: z.array(Option$).default([]),
    startInscriptionDate: z.coerce.date().min(new Date()),
    endInscriptionDate: z.coerce.date().min(new Date()),

    // Default settings
    admins: z.array(Admin$),
    email: z.string().email(),

    // Advanced settings
    closeDate: z.coerce.date().min(new Date()).optional(),
    freeClubs: z.array(Club$).default([]),
    oneDayPermissions: z.array(z.nativeEnum(ONE_DAY_PERMISSION)).default([]),
    oneDayBibStart: z.number().positive().max(9999).min(9900).default(9900),
        
});
export type Competition = z.infer<typeof Competition$>;

export const BaseCompetition$ = Competition$.pick({
    name: true,
    date: true,
    method: true,
    publish: true,
    description: true,
    oneDayBibStart: true,
    oneDayPermissions: true,
});
export type BaseCompetition = z.infer<typeof BaseCompetition$>;

export const BaseCompetitionWithRelationId$ = BaseCompetition$.extend({
    paymentPlanId: z.number(),
    optionsId: z.array(z.number()).default([]),
});
export type BaseCompetitionWithRelationId = z.infer<typeof BaseCompetitionWithRelationId$>;

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
    paymentPlanId: z.number(),
    optionsId: z.array(z.number()).default([]),
    freeClubsId: z.array(z.number()).default([]),
});
export type UpdateCompetitionWithRelationId = z.infer<typeof UpdateCompetitionWithRelationId$>;

export const DisplayCompetition$ = Competition$.pick({
    eid: true,
    name: true,
    date: true,
});
export type DisplayCompetition = z.infer<typeof DisplayCompetition$>;