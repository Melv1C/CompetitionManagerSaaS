/**
 * File: apps/competition-manager-web/src/Pages/Admin/Competition/Results/types.ts
 *
 * Description: TypeScript interfaces for XML result data structures.
 * These types are used for parsing and processing competition result XML files.
 */

import {
    Abbr$,
    Athlete$,
    Boolean$,
    CompetitionEvent$,
    Gender,
    UpsertResult$,
} from '@competition-manager/schemas';
import { z } from 'zod';

/**
 * Schema for a single result detail from the XML file
 * Contains the actual performance value and other related data
 */
export const XmlResultDetail$ = z.object({
    result_value: z.coerce.number(),
    wind: z.coerce.number(),
    value: z.coerce.string(),
    seqno: z.coerce.number(),
});

/**
 * Schema for a participant entry in the competition
 */
export const XmlParticipation$ = z.object({
    participant: z.object({
        competitor: z.object({
            license: Athlete$.shape.license,
            bib: Athlete$.shape.bib,
            athlete: z.object({
                firstname: Athlete$.shape.firstName,
                lastname: Athlete$.shape.lastName,
                gender: z
                    .union([z.literal('M'), z.literal('W')])
                    .transform((data) => (data === 'M' ? Gender.M : Gender.F)),
                birthdate: Athlete$.shape.birthdate,
            }),
            team: z.object({
                abbreviation: Abbr$,
            }),
        }),
    }),
    initialorder: z.coerce.number(),
    currentorder: z.coerce.number(),
    points: z.coerce.number(),
    results: z
        .object({
            result: z
                .union([XmlResultDetail$, z.array(XmlResultDetail$)])
                .transform((data) => (Array.isArray(data) ? data : [data])),
        })
        .optional()
        .or(z.literal('').transform(() => undefined)),
});

/**
 * Schema for a heat (series) from the XML file
 */
export const XmlHeat$ = z.object({
    participations: z.object({
        participation: z
            .union([XmlParticipation$, z.array(XmlParticipation$)])
            .transform((data) => (Array.isArray(data) ? data : [data])),
    }),
});

/**
 * Schema for a round of competition from the XML file
 */
export const XmlRound$ = z.object({
    heats: z
        .union([
            z.object({
                heat: z.union([XmlHeat$, z.array(XmlHeat$)]).transform((h) => Array.isArray(h) ? h : [h]),
            }),
            z.literal(''), // supporte <heats></heats> ou <heats/>
        ])
        .optional()
        .transform((val) => (val === '' ? undefined : val)),
    '@_combinedTotal': Boolean$,
    name: z.coerce.string(),
});

export const XmlEvent$ = z.object({
    name: CompetitionEvent$.shape.name,
    rounds: z.object({
        round: z
            .union([XmlRound$, z.array(XmlRound$)])
            .transform((data) => (Array.isArray(data) ? data : [data])),
    }),
});

/**
 * Schema for top-level structure for event data in the XML file
 */
export const XmlData$ = z.union([
    z.object({ event: XmlEvent$ }),
    z.object({
        events: z.object({
            event: z.union([XmlEvent$, z.array(XmlEvent$)]).transform((data) => (Array.isArray(data) ? data : [data])),
        }),
    }),
]);

/**
 * Type definitions inferred from the schemas
 */
export type XmlResultDetail = z.infer<typeof XmlResultDetail$>;
export type XmlParticipation = z.infer<typeof XmlParticipation$>;
export type XmlHeat = z.infer<typeof XmlHeat$>;
export type XmlRound = z.infer<typeof XmlRound$>;
export type XmlData = z.infer<typeof XmlData$>;
export type XmlEvent = z.infer<typeof XmlEvent$>;

/**
 * Schema for extended result type that includes display-oriented information
 * Extends the UpsertResult schema with additional fields for UI display purposes
 */
export const DisplayResult$ = UpsertResult$.extend({
    /** Athlete's first name */
    firstName: Athlete$.shape.firstName,
    /** Athlete's last name */
    lastName: Athlete$.shape.lastName,
    /** Club abbreviation */
    club: Abbr$,
    /** Athlete's points in the competition */
    points: z.coerce.number(),
});

/**
 * Type definition for DisplayResult extracted from the schema
 */
export type DisplayResult = z.infer<typeof DisplayResult$>;
