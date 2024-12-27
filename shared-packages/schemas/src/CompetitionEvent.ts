import { z } from 'zod';
import { Category$, Event$, Id$, Name$, Price$ } from '.';

export const CompetitionEvent$ = z.object({
    id: Id$,
    name: Name$,
    event: Event$,
    schedule: z.coerce.date().min(new Date()),
    categories: z.array(Category$),
    place: z.number().positive().int().optional(),
    parentId: Id$.optional(),
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
    parentId: Id$.optional(),
})
export type BaseCompetitionEventWithRealtionId = z.infer<typeof BaseCompetitionEventWithRealtionId$>;