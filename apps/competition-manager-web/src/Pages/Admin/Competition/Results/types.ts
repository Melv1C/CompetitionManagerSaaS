/**
 * File: apps/competition-manager-web/src/Pages/Admin/Competition/Results/types.ts
 *
 * Description: TypeScript interfaces for XML result data structures.
 * These types are used for parsing and processing competition result XML files.
 */

/**
 * Represents a single result detail from the XML file
 * Contains the actual performance value and optional wind data
 */
export interface XmlResultDetail {
    result_value: string;
    wind?: string;
    value?: string;
}

/**
 * Represents a heat (series) from the XML file
 * Contains one or more participant entries
 */
export interface XmlHeat {
    participations: {
        participation: XmlParticipation | XmlParticipation[];
    };
}

/**
 * Represents a participant entry in the competition
 * Includes competitor information, order data, and result details
 */
export interface XmlParticipation {
    participant: {
        competitor: {
            license: string | number;
            bib: string | number;
        };
    };
    initialorder: string | number;
    currentorder: string | number;
    results: {
        result: XmlResultDetail | XmlResultDetail[];
    };
}

/**
 * Represents a round of competition from the XML file
 * Contains one or more heats and optional combined total flag
 */
export interface XmlRound {
    heats: {
        heat: XmlHeat | XmlHeat[];
    };
    '@_combinedTotal'?: string;
}

/**
 * Top-level structure for event data in the XML file
 * Contains event name and rounds information
 */
export interface XmlEventData {
    event: {
        name: string;
        rounds: {
            round: XmlRound | XmlRound[];
        };
    };
}
