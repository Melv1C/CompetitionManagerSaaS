/**
 * File: apps/competition-manager-web/src/Pages/Admin/Competition/Results/hooks.ts
 *
 * Description: React hooks for processing competition result files and uploading results.
 * Provides functionality for file content processing and API communication.
 */

import { api } from '@/utils';
import { CreateResult, EventType } from '@competition-manager/schemas';
import { useState } from 'react';
import { handleHeats, parseXmlFile } from './utils';

/**
 * Interface for competition data structure
 */
export interface CompetitionData {
    eid: string;
    events: {
        eid: string;
        name: string;
        event: {
            type: EventType;
        };
    }[];
}

/**
 * Custom hook for processing uploaded result files
 *
 * @param eventEid - ID of the selected event or 'autoDetect'
 * @param competition - Competition data containing events information
 * @returns Object with state and functions for file processing
 */
export const useFileProcessing = (
    eventEid: string,
    competition: CompetitionData
) => {
    const [results, setResults] = useState<CreateResult[]>([]);
    const [error, setError] = useState<string | null>(null);
    const [isTableVisible, setIsTableVisible] = useState(false);

    /**
     * Processes the content of an XML file into structured result data
     *
     * @param fileContent - String content of the XML file
     * @returns Promise that resolves when processing is complete
     */
    const processFileContent = async (fileContent: string): Promise<void> => {
        setError(null);

        try {
            // Parse the XML data
            const parsedData = parseXmlFile(fileContent);
            const eventData = parsedData.event;
            const eventName = eventData.name;
            const rounds = eventData.rounds.round;

            // Find the matching event in competition data
            const event =
                eventEid === 'autoDetect'
                    ? competition.events.find(
                          (event) => event.name === eventName
                      )
                    : competition.events.find(
                          (event) => event.eid === eventEid
                      );

            if (!event) throw new Error('Event not found in competition data');

            let processedResults: CreateResult[] = [];

            // Process single round case
            if (!Array.isArray(rounds)) {
                const heats = rounds.heats.heat;
                processedResults = handleHeats(
                    heats,
                    event.eid,
                    competition.eid,
                    event.event.type
                );
            }
            // Process multiple rounds case
            else {
                for (const round of rounds) {
                    if (round['@_combinedTotal'] === 'false') {
                        const heats = round.heats.heat;
                        const roundResults = handleHeats(
                            heats,
                            event.eid,
                            competition.eid,
                            event.event.type
                        );
                        processedResults.push(...roundResults);
                    }
                }
            }

            setResults(processedResults);
            setIsTableVisible(true);
        } catch (error) {
            if (
                error instanceof Error &&
                error.message === 'Event not found in competition data'
            ) {
                setError(error.message);
            } else {
                console.error('Error processing XML:', error);
                setError('Failed to process XML data');
            }
            setIsTableVisible(false);
        }
    };

    return {
        results,
        setResults,
        error,
        setError,
        isTableVisible,
        setIsTableVisible,
        processFileContent,
    };
};

/**
 * Custom hook for uploading results to the API
 *
 * @returns Object with state and functions for result uploading
 */
export const useResultsUpload = () => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    /**
     * Uploads result data to the server API
     *
     * @param results - Array of result objects to upload
     * @returns Promise that resolves to true when upload succeeds
     * @throws Error when upload fails
     */
    const uploadResults = async (results: CreateResult[]): Promise<boolean> => {
        setLoading(true);
        setError(null);

        try {
            await api.post('/results', results);
            setLoading(false);
            return true;
        } catch (error) {
            console.error(error);
            setError('Failed to upload results');
            setLoading(false);
            throw error;
        }
    };

    return {
        uploadResults,
        loading,
        error,
        setError,
    };
};
