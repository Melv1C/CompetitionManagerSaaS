import { z } from 'zod';
import { Id$, Name$, Price$ } from './Base';
import { Category$ } from './Category';
import { Event$ } from './Event';

export const CompetitionEvent$ = z.object({
    id: Id$,
    name: Name$,
    event: Event$,
    schedule: z.coerce.date().min(new Date()),
    categories: z.array(Category$),
    place: z.number().positive().int().nullish(),
    parentId: Id$.nullish(),
    cost: Price$,
    isInscriptionOpen: z.boolean().default(true),
});
export type CompetitionEvent = z.infer<typeof CompetitionEvent$>;

export const BaseCompetitionEvent$ = CompetitionEvent$.pick({
    name: true,
    schedule: true,
    place: true,
    cost: true,
    isInscriptionOpen: true,
});
export type BaseCompetitionEvent = z.infer<typeof BaseCompetitionEvent$>;

export const BaseCompetitionEventWithRealtionId$ = BaseCompetitionEvent$.extend({
    eventId: Id$,
    categoriesId: z.array(Id$),
    parentId: Id$.nullish(),
})
export type BaseCompetitionEventWithRealtionId = z.infer<typeof BaseCompetitionEventWithRealtionId$>;