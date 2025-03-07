/**
 * File: apps/competition-manager-web/src/Pages/Admin/Competition/Results/utils.ts
 *
 * Description: Utility functions for processing competition results data.
 * Includes functions to parse XML files, handle heat data, and format attempt values.
 */

import {
    AttemptValue,
    CreateResult,
    CreateResult$,
    CreateResultDetails$,
    EventType,
} from '@competition-manager/schemas';
import { XMLParser } from 'fast-xml-parser';
import { z } from 'zod';
import { XmlHeat, XmlResultDetail } from './types';

/**
 * Extracts attempt values from result data
 *
 * @param result - Array of XML result details
 * @param index - Index of the current result
 * @returns Array of attempt values or undefined
 */
export const getAttemptValue = (
    result: XmlResultDetail[],
    index: number
): AttemptValue[] | undefined => {
    if (result[index].value == 'X') {
        let i = 1;
        while (result[index + i]?.value == 'X') {
            i++;
        }
        const attemptArray: AttemptValue[] = Array(i).fill(AttemptValue.X);
        if (i < 3) {
            attemptArray.push(AttemptValue.O);
        }
        return attemptArray;
    }
    return [AttemptValue.O];
};

/**
 * Processes heat data from XML into CreateResult objects
 *
 * @param heats - Heat data from XML file (single or array)
 * @param eventEid - Event ID
 * @param competitionEid - Competition ID
 * @param eventType - Type of event
 * @returns Array of processed results
 */
export const handleHeats = (
    heats: XmlHeat | XmlHeat[],
    eventEid: string,
    competitionEid: string,
    eventType: EventType
): CreateResult[] => {
    const results: CreateResult[] = [];

    // Ensure heats is always an array
    const heatsArray = Array.isArray(heats) ? heats : [heats];

    for (let i = 0; i < heatsArray.length; i++) {
        const heat = heatsArray[i];
        if (!heat) continue;

        // Ensure participations is always an array
        const participations = Array.isArray(heat.participations.participation)
            ? heat.participations.participation
            : [heat.participations.participation];

        for (const participation of participations) {
            const competitor = participation.participant.competitor;
            const athleteLicense = String(competitor.license);
            const bib = parseInt(String(competitor.bib));
            const initialOrder = parseInt(String(participation.initialorder));
            const currentOrder = parseInt(String(participation.currentorder));

            // Ensure results is always an array
            const results_details = Array.isArray(participation.results.result)
                ? participation.results.result
                : [participation.results.result];

            const details: z.infer<typeof CreateResultDetails$>[] = [];
            let tryNumber = 1;

            for (let j = 0; j < results_details.length; j++) {
                const result = results_details[j];
                if (!result) continue;

                const detail: z.infer<typeof CreateResultDetails$> = {
                    tryNumber: tryNumber,
                    value: parseFloat(result.result_value),
                    wind: result.wind ? parseFloat(result.wind) : undefined,
                    attempts:
                        eventType == EventType.HEIGHT
                            ? getAttemptValue(
                                  results_details as XmlResultDetail[],
                                  j
                              )
                            : undefined,
                };

                if (detail.attempts && detail.attempts.length > 1) {
                    j += detail.attempts.length - 1;
                }

                details.push(detail);
                tryNumber++;
            }

            const createResult: z.infer<typeof CreateResult$> = {
                bib,
                athleteLicense,
                competitionEid,
                competitionEventEid: eventEid,
                heat: i + 1,
                initialOrder: initialOrder,
                tempOrder: currentOrder,
                finalOrder: currentOrder,
                details,
            };

            results.push(createResult);
        }
    }

    return results;
};

/**
 * Parses XML file content into a JavaScript object
 *
 * @param fileData - String content of an XML file
 * @returns Parsed JavaScript object representing the XML structure
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const parseXmlFile = (fileData: string): any => {
    const parser = new XMLParser({
        ignoreAttributes: false,
        parseAttributeValue: true,
        trimValues: true,
    });

    return parser.parse(fileData);
};
