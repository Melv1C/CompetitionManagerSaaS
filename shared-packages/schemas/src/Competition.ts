import { z } from 'zod';
import { Athlete$ } from './Athlete';
import { CompetitionEvent$ } from './CompetitionEvent';
import { on } from 'events';




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
    paid: z.boolean().default(true),
    freeClub: z.boolean().default(true),// a discuter
    pdfScedule: z.string().optional(),
    //close ? archived ? finished ?: z.boolean().default(false), ? or an end date
    email: z.string().email().optional(),
    admin: z.string().min(1),
});

export type Competition = z.infer<typeof Competition$>;