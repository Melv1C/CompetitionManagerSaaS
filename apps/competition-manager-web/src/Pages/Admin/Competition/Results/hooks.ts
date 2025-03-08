/**
 * File: apps/competition-manager-web/src/Pages/Admin/Competition/Results/hooks.ts
 *
 * Description: React hooks for processing competition result files and uploading results.
 * Provides functionality for file content processing and API communication.
 */

import { Competition, CompetitionEvent } from '@competition-manager/schemas';
import { useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { DisplayResult, XmlData, XmlData$ } from './types';
import { handleHeats, parseXmlFile } from './utils';

/**
 * Custom hook for processing uploaded result files
 *
 * @param competition - Competition data containing events information
 * @returns Object with state and functions for file processing
 */
export const useFileProcessing = (competition: Competition) => {
    // Using DisplayResult type to store enhanced result information
    const [results, setResults] = useState<DisplayResult[]>([]);
    const [error, setError] = useState<string | null>(null);
    const [isTableVisible, setIsTableVisible] = useState(false);
    const [isProcessing, setIsProcessing] = useState(false);
    // States for handling event selection
    const [needsEventSelection, setNeedsEventSelection] = useState(false);
    const [pendingXmlData, setPendingXmlData] = useState<XmlData | null>(null);

    // Memoize available events to prevent unnecessary re-renders
    const availableEvents = useMemo(
        () => competition.events,
        [competition.events]
    );

    const { t } = useTranslation();

    /**
     * Processes the content of an XML file into structured result data
     * Extracts both required backend fields and additional display information
     *
     * @param fileContent - String content of the XML file
     * @returns Promise that resolves when processing is complete
     */
    const processFileContent = async (fileContent: string): Promise<void> => {
        setError(null);
        setIsProcessing(true);

        try {
            // Parse the XML data
            const parsedData = XmlData$.parse(parseXmlFile(fileContent));
            const eventName = parsedData.event.name;

            // Find the matching event in competition data - try exact match first
            let event = competition.events.find(
                (event) => event.name.toLowerCase() === eventName.toLowerCase()
            );

            // If no exact match, try to find a similar event
            if (!event) {
                event = competition.events.find(
                    (event) =>
                        event.name
                            .toLowerCase()
                            .includes(eventName.toLowerCase()) ||
                        eventName
                            .toLowerCase()
                            .includes(event.name.toLowerCase())
                );
            }

            if (!event) {
                // Instead of throwing error, store data and prompt for selection
                setPendingXmlData(parsedData);
                setNeedsEventSelection(true);
                return;
            }

            // Process data with the found event
            await processWithEvent(parsedData, event);
        } catch (error) {
            console.error('Error processing XML:', error);
            setError(
                t('result:failedToReadFile') +
                    `: ${
                        error instanceof Error
                            ? error.message
                            : t('result:unknownError')
                    }`
            );
            setIsTableVisible(false);
        } finally {
            setIsProcessing(false);
        }
    };

    /**
     * Processes the XML data using a specific event
     * Called either automatically when event is found or after user selection
     *
     * @param parsedData - The parsed XML data
     * @param event - The selected event from competition data
     */
    const processWithEvent = async (
        parsedData: XmlData,
        event: CompetitionEvent
    ): Promise<void> => {
        try {
            const rounds = parsedData.event.rounds.round;

            // Array to hold all processed results with display information
            let processedResults: DisplayResult[] = [];

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
                    if (round['@_combinedTotal'] === false) {
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

            // Sort results by order for better presentation
            processedResults.sort((a, b) => a.finalOrder - b.finalOrder);

            setResults(processedResults);
            setIsTableVisible(true);
            // Reset selection state
            setPendingXmlData(null);
            setNeedsEventSelection(false);
        } catch (error) {
            console.error('Error processing with selected event:', error);
            setError(
                t('result:eventProcessingFailed') +
                    `: ${
                        error instanceof Error
                            ? error.message
                            : t('result:unknownError')
                    }`
            );
            setIsTableVisible(false);
        }
    };

    /**
     * Handles user event selection from the popup
     *
     * @param selectedEventEid - The ID of the event selected by the user
     */
    const handleEventSelection = (selectedEventEid: string): void => {
        if (!pendingXmlData) {
            setError(t('result:noPendingData'));
            return;
        }

        const selectedEvent = competition.events.find(
            (event) => event.eid === selectedEventEid
        );

        if (!selectedEvent) {
            setError(t('result:eventNotFound'));
            return;
        }

        processWithEvent(pendingXmlData, selectedEvent);
    };

    /**
     * Cancels the event selection process
     */
    const cancelEventSelection = (): void => {
        setPendingXmlData(null);
        setNeedsEventSelection(false);
        setError(t('result:selectionCanceled'));
    };

    return {
        results,
        setResults,
        error,
        setError,
        isTableVisible,
        setIsTableVisible,
        isProcessing,
        processFileContent,
        needsEventSelection,
        handleEventSelection,
        cancelEventSelection,
        availableEvents,
    };
};
