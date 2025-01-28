import { z } from 'zod';
import { Date$, Eid$, Id$, Name$, Place$, Price$ } from './Base';
import { Category$ } from './Category';
import { Event$ } from './Event';

export const CompetitionEvent$ = z.object({
    id: Id$,
    eid: Eid$,
    name: Name$,
    event: Event$,
    schedule: Date$,
    categories: z.array(Category$),
    place: Place$.nullish(),
    parentId: Id$.nullish(),
    cost: Price$,
    isInscriptionOpen: z.boolean().default(true),
});
export type CompetitionEvent = z.infer<typeof CompetitionEvent$>;

export const CreateCompetitionEvent$ = CompetitionEvent$.omit({
    id: true,
    eid: true,
    event: true,
    categories: true,
}).extend({
    eventId: Id$,
    categoriesId: z.array(Id$),
})
export type CreateCompetitionEvent = z.infer<typeof CreateCompetitionEvent$>;

export const UpdateCompetitionEvent$ = CreateCompetitionEvent$
export type UpdateCompetitionEvent = z.infer<typeof UpdateCompetitionEvent$>;