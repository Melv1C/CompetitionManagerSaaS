/**
 * File: apps/competition-manager-web/src/Pages/Admin/Competition/Results/hooks.ts
 *
 * Description: React hooks for processing competition result files and uploading results.
 * Provides functionality for file content processing and API communication.
 */

import { Competition } from '@competition-manager/schemas';
import { useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { DisplayResult, XmlData, XmlData$, XmlEvent, XmlRound } from './types';
import { handleHeats, parseXmlFile } from './utils';

/**
 * Result type with round information
 */
type ResultsByRound = {
    roundName: string;
    eventEid: string;
    eventName: string;
    results: DisplayResult[];
};

/**
 * Custom hook for processing uploaded result files
 *
 * @param competition - Competition data containing events information
 * @returns Object with state and functions for file processing
 */
export const useFileProcessing = (competition: Competition) => {
    // Using DisplayResult type to store enhanced result information
    const [results, setResults] = useState<DisplayResult[]>([]);
    // Results organized by rounds for multi-round files
    const [resultsByRounds, setResultsByRounds] = useState<ResultsByRound[]>(
        []
    );
    const [error, setError] = useState<string | null>(null);
    const [isTableVisible, setIsTableVisible] = useState(false);
    const [isProcessing, setIsProcessing] = useState(false);
    // States for handling event selection
    const [needsEventSelection, setNeedsEventSelection] = useState(false);
    const [pendingXmlData, setPendingXmlData] = useState<XmlData | null>(null);
    // Track if we have multiple rounds
    const [hasMultipleRounds, setHasMultipleRounds] = useState(false);
    // Track round names for selection
    const [roundNames, setRoundNames] = useState<string[]>([]);

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
        setResultsByRounds([]);
        setHasMultipleRounds(false);

        try {
            // Parse the XML data
            const parsedData = XmlData$.parse(parseXmlFile(fileContent));
            console.log('Parsed XML Data:', parsedData);

            // Handle the two possible XML structures
            if ('event' in parsedData) {
                // Single event case
                const eventName = parsedData.event.name;
                await handleSingleEvent(parsedData.event, eventName);
            } else if ('events' in parsedData) {
                //todo
                throw new Error(
                    t('result:multipleEventsNotSupported')
                );
            }
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
    };    /**
     * Handles a single event in the XML
     */
    const handleSingleEvent = async (event: XmlEvent, eventName: string) => {
        // Check if there are multiple rounds
        const rounds = event.rounds.round;

        if (Array.isArray(rounds) && rounds.length > 1) {
            // Multiple rounds in a single event
            setHasMultipleRounds(true);
            const names = rounds.map((r) => r.name);
            setRoundNames(names);
            
            // Check if each round name matches an event before asking for selection
            const eventSelections: Record<string, string> = {};
            let allRoundsMatched = true;
            
            for (const round of rounds) {
                const roundName = round.name;
                if (round['@_combinedTotal']) {
                    // Skip combined total rounds
                    continue;
                }

                // Try to find an exact match for the round name in events
                const matchedEvent = competition.events.find(
                    (e) => e.name.toLowerCase() === roundName.toLowerCase()
                );
                
                if (matchedEvent) {
                    // Store the match
                    eventSelections[roundName] = matchedEvent.eid;
                } else {
                    // No match found for this round
                    allRoundsMatched = false;
                    break;
                }
            }
            
            // Only ask for selection if at least one round doesn't match
            if (!allRoundsMatched) {
                setPendingXmlData({ event });
                setNeedsEventSelection(true);
                return;
            } else {
                // All rounds matched, process directly with the matches
                await processWithEvent(event, eventSelections);
                return;
            }
        }

        // Find the matching event in competition data - try exact match first
        let matchedEvent = competition.events.find(
            (e) => e.name.toLowerCase() === eventName.toLowerCase()
        );

        // If no exact match, try to find a similar event
        if (!matchedEvent) {
            matchedEvent = competition.events.find(
                (e) =>
                    e.name.toLowerCase().includes(eventName.toLowerCase()) ||
                    eventName.toLowerCase().includes(e.name.toLowerCase())
            );
        }

        if (!matchedEvent) {
            // Instead of throwing error, store data and prompt for selection
            setPendingXmlData({ event });
            setNeedsEventSelection(true);
            return;
        }

        // Process data with the found event
        await processWithEvent(event, { event: matchedEvent.eid });
    };

    /**
     * Process a single round of results
     *
     * @param round - Round data from XML
     * @param eventEid - Selected event ID
     * @param roundName - Name of the round
     * @returns Processed results for the round or null if processing failed
     */
    const processRound = (
        round: XmlRound,
        eventEid: string,
        roundName: string
    ): ResultsByRound | null => {
        console.log('Processing round:', round);
        const selectedEvent = competition.events.find(
            (e) => e.eid === eventEid
        );

        if (!selectedEvent) {
            console.warn(`Event ${eventEid} not found for round ${roundName}`);
            return null;
        }

        if (!round.heats) {
            return null;
        }

        const heats = round.heats.heat;
        if (!heats) return null;

        const processedResults = handleHeats(
            heats,
            selectedEvent.eid,
            competition.eid,
            selectedEvent.event.type
        );

        // Sort by order
        processedResults.sort(
            (a, b) => (a.finalOrder || 0) - (b.finalOrder || 0)
        );

        if (processedResults.length === 0) {
            console.warn(`No results found for round ${roundName}`);
            return null;
        }

        return {
            roundName,
            eventEid: selectedEvent.eid,
            eventName: selectedEvent.name,
            results: processedResults,
        };
    };

    /**
     * Processes the XML data using a specific event
     * Called either automatically when event is found or after user selection
     *
     * @param parsedData - The parsed XML data
     * @param eventSelections - Map of round names to event IDs
     */
    const processWithEvent = async (
        event: XmlEvent,
        eventSelections: Record<string, string>
    ): Promise<void> => {
        try {
            // Initialize result arrays
            let allResults: DisplayResult[] = [];
            const roundResults: ResultsByRound[] = [];
            const rounds = event.rounds.round;
            // Process single round case
            if (!Array.isArray(rounds)) {
                const eventEid =
                    eventSelections.event || eventSelections.default;
                const selectedEvent = competition.events.find(
                    (e) => e.eid === eventEid
                );

                if (!selectedEvent) {
                    throw new Error(t('result:eventNotFound'));
                }

                // Process the single round
                const round = rounds as unknown as XmlRound; // Type assertion for the round
                const defaultRoundName = round.name;
                const roundResult = processRound(
                    round,
                    eventEid,
                    defaultRoundName
                );

                if (roundResult) {
                    allResults = [...roundResult.results];
                    roundResults.push(roundResult);
                }
            } else { // Process multiple rounds
                for (const round of rounds) {
                    if (round['@_combinedTotal']) {
                        // Skip combined total rounds
                        continue;
                    }
                    const roundName = round.name;
                    const eventEid =
                        eventSelections[roundName] ||
                        eventSelections.event ||
                        eventSelections.default;

                    if (!eventEid) {
                        console.warn(
                            `No event selected for round ${roundName}`
                        );
                        continue;
                    }

                    const roundResult = processRound(
                        round,
                        eventEid,
                        roundName
                    );
                    if (roundResult) {
                        allResults = [
                            ...allResults,
                            ...roundResult.results,
                        ];
                        roundResults.push(roundResult);
                    }
                }
            }

            // Update states
            setResults(allResults);
            setResultsByRounds(roundResults);
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
     * @param eventSelections - Map of round names to selected event IDs
     */
    const handleEventSelection = (
        eventSelections: Record<string, string>
    ): void => {
        if (!pendingXmlData) {
            setError(t('result:noPendingData'));
            return;
        }

        // Combine pre-matched events (if any) with user selections
        const combinedSelections = { ...eventSelections };

        const event = 'event' in pendingXmlData ? pendingXmlData.event : null;
        if (!event) {
            setError(t('result:noEventFound'));
            return;
        }

        // Process the XML with the combined selections
        processWithEvent(event, combinedSelections);
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
        resultsByRounds,
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
        hasMultipleRounds,
        roundNames,
    };
};
