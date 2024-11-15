import { z } from 'zod';
import { Athlete$ } from './Athlete';
import { CompetitionEvent$ } from './CompetitionEvent';
import { User$ } from './User';

const ACCESS = ['inscriptions', 'competitions', 'confirmations', 'liveResults'] as const;
type Access = typeof ACCESS[number];

const PaymentInfo$ = z.object({
    id: z.number().positive(),
    free: z.boolean().default(false),
    online: z.boolean().default(true),
    freeClub: z.array(z.string()),
});

const Admin$ = z.object({
    id: z.number().positive(),
    user: User$,
    access: z.array(z.enum(ACCESS)),
});


export const Competition$ = z.object({
    id: z.number().positive(),
    eid: z.string().min(1),
    name: z.string().min(1),
    description: z.string().min(1),
    oneDayAthletes: z.array(Athlete$),
    oneDayBibStart: z.number().positive().max(9999).min(9900).default(9900),
    startDate: z.coerce.date().min(new Date()),  //test if .min(new Date() works
    startInscriptionDate: z.coerce.date().min(new Date()),
    endInscriptionDate: z.coerce.date().min(new Date()),
    events: z.array(CompetitionEvent$),
    visible: z.boolean().default(false),
    open: z.boolean().default(false),
    openDate: z.coerce.date().min(new Date()).optional(),//
    place: z.string().min(1),
    paiment: PaymentInfo$,
    freeClub: z.boolean().default(true),// a discuter
    pdfScedule: z.string().optional(),
    //close ? archived ? finished ?: z.boolean().default(false), ? or an end date
    email: z.string().email().optional(),
    owner: User$,
    admin: z.array(Admin$),
});

export type Competition = z.infer<typeof Competition$>;