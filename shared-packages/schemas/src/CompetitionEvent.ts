import { z } from 'zod';
import { Event$ } from './Event';
import { Category$ } from './Category';
import { Id$ } from './Id';

export const CompetitionEvent$ = z.object({
    id: z.number().positive(),
    name: z.string(),
    event: Event$,
    schedule: z.coerce.date().min(new Date()),
    categories: z.array(Category$),
    place: z.number().positive().int().optional(),
    parentId: z.number().positive().optional(),
    cost: z.number().nonnegative(),
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
    parentId: Id$.optional(),
})
export type BaseCompetitionEventWithRealtionId = z.infer<typeof BaseCompetitionEventWithRealtionId$>;