/**
 * File: apps/competition-manager-web/src/Pages/Admin/Competition/Results/utils.ts
 *
 * Description: Utility functions for processing competition results data.
 * Includes functions to parse XML files, handle heat data, and format attempt values.
 */

import {
    AttemptValue,
    CreateResultDetail,
    EventType,
    ResultDetailCode,
} from '@competition-manager/schemas';
import { XMLParser } from 'fast-xml-parser';
import { DisplayResult$, XmlHeat, XmlResultDetail } from './types';

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
): AttemptValue[] => {
    if (result[index].value == AttemptValue.X) {
        let i = 1;
        while (result[index + i]?.value == AttemptValue.X) {
            i++;
        }
        const attemptArray: AttemptValue[] = Array(i).fill(AttemptValue.X);
        if (i < 3) {
            // Add a successful attempt (O) after consecutive failures if less than 3 failures
            attemptArray.push(AttemptValue.O);
        }
        return attemptArray;
    }
    return [AttemptValue.O];
};

/**
 * Processes heat data from XML into DisplayResult objects
 *
 * @param heats - Heat data from XML file (single or array)
 * @param eventEid - Event ID
 * @param competitionEid - Competition ID
 * @param eventType - Type of event
 * @returns Array of processed results with display information
 * @throws Error if required participant data is missing
 */
export const handleHeats = (
    heats: XmlHeat[],
    eventEid: string,
    competitionEid: string,
    eventType: EventType
) => {
    const results = [];

    for (let i = 0; i < heats.length; i++) {
        const heat = heats[i];
        if (!heat) continue;

        // Ensure participations is always an array
        const participations = heat.participations.participation;

        for (const participation of participations) {
            try {
                const details: CreateResultDetail[] = [];
                let tryNumber = 1;

                // Validate participation has necessary data
                if (!participation.participant?.competitor) {
                    console.warn(
                        'Skipping participation with missing competitor data'
                    );
                    continue;
                }

                if (!participation.results?.result) {
                    console.warn('Skipping participation with missing results data');
                    continue;
                }
                
                for (let j = 0; j < participation.results.result.length; j++) {
                    const result = participation.results.result[j];
                    let value = result.result_value;
                    if (value < 0) {
                        switch (value) {
                            case -8:
                                value = ResultDetailCode.R;
                                break;
                            default:
                                break;
                        }
                    } else if (eventType == EventType.TIME) {
                        // Convert time to milliseconds
                        value *= 1000;
                    }
                    const detail: CreateResultDetail = {
                        tryNumber: eventType == EventType.HEIGHT ? value : tryNumber,
                        value,
                        wind: result.wind,
                        attempts:
                            eventType == EventType.HEIGHT
                                ? getAttemptValue(
                                      participation.results.result,
                                      j
                                  )
                                : [],
                    };

                    if (detail.attempts && detail.attempts.length > 1) {
                        // Skip additional records that were included in the attempts array
                        j += detail.attempts.length - 1;
                    }

                    details.push(detail);
                    tryNumber++;
                }

                const displayResult = DisplayResult$.parse({
                    competitionEid: competitionEid,
                    competitionEventEid: eventEid,
                    athleteLicense:
                        participation.participant.competitor.license,
                    bib: participation.participant.competitor.bib,
                    license: participation.participant.competitor.license,
                    firstName:
                        participation.participant.competitor.athlete.firstname,
                    lastName:
                        participation.participant.competitor.athlete.lastname,
                    club: participation.participant.competitor.team
                        .abbreviation,
                    heat: i + 1,
                    points: participation.points,
                    initialOrder: participation.initialorder,
                    tempOrder: participation.currentorder,
                    finalOrder: participation.currentorder,

                    details: details,
                });

                results.push(displayResult);
            } catch (error) {
                console.error('Error processing participation:', error);
                // Continue processing other participations despite the error
            }
        }
    }

    return results;
};

/**
 * Parses XML file content into a JavaScript object
 *
 * @param fileData - String content of an XML file
 * @returns Parsed JavaScript object representing the XML structure
 * @throws Error if parsing fails
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const parseXmlFile = (fileData: string): any => {
    try {
        const parser = new XMLParser({
            ignoreAttributes: false,
            parseAttributeValue: true,
            trimValues: true,
        });

        return parser.parse(fileData);
    } catch (error) {
        console.error('XML parsing error:', error);
        throw new Error(
            `Failed to parse XML: ${
                error instanceof Error ? error.message : 'Unknown error'
            }`
        );
    }
};

export const formatValueDistance = (value: number | undefined) => {
    if (value === undefined) return '';
    if (value === ResultDetailCode.X) return 'X';
    if (value === ResultDetailCode.PASS) return '-';
    if (value === ResultDetailCode.R) return 'r';
    return value.toString();
};

export const extractValueDistance = (value: string) => {
    switch (value) {
        case 'X':
            return ResultDetailCode.X;
        case '-':
            return ResultDetailCode.PASS;
        case 'r':
            return ResultDetailCode.R;
        case '':
            return null;
        default:
            return parseFloat(value.replace(',', '.'));
    }
};