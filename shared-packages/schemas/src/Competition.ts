import { z } from 'zod';
import { CompetitionEvent$ } from './CompetitionEvent';
import { User$ } from './User';

export const ACCESS = ['owner', 'inscriptions', 'competitions', 'confirmations', 'liveResults'] as const;
export type Access = typeof ACCESS[number];

export const PAYMENT_METHOD = ['free', 'online', 'onPlace'] as const;
export type PaymentMethod = typeof PAYMENT_METHOD[number];

export const ONE_DAY_PERMISSION = ['foreing', 'all', 'bpm'] as const;
export type OneDayPermission = typeof ONE_DAY_PERMISSION[number];

export const Admin$ = z.object({
    id: z.number().positive(),
    user: User$,
    access: z.array(z.enum(ACCESS)),
});


export const Competition$ = z.object({
    id: z.number().positive(),
    eid: z.string().min(1),

    // Basic info
    name: z.string().min(1),
    date: z.coerce.date().min(new Date()),  //test if .min(new Date() works

    // Other info
    description: z.string().min(1),
    events: z.array(CompetitionEvent$).optional(),
    publish: z.boolean().default(false),
    method: z.enum(PAYMENT_METHOD),
    startInscriptionDate: z.coerce.date().min(new Date()),
    endInscriptionDate: z.coerce.date().min(new Date()),

    // Default settings
    admins: z.array(Admin$),
    email: z.string().email(),

    // Advanced settings
    closeDate: z.coerce.date().min(new Date()).optional(),
    freeClubs: z.array(z.string()),
    oneDayPermissions: z.array(z.enum(ONE_DAY_PERMISSION)),
    oneDayBibStart: z.number().positive().max(9999).min(9900).default(9900),
        
});

export type Competition = z.infer<typeof Competition$>;