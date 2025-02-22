/**
 * Main entry point for the Inscriptions module
 * This file exports all inscription-related components and types
 */

import { Paper, Stack } from "@mui/material";
import { UserInscriptionsSection } from "./UserInscriptionsSection";
import { useAtomValue } from "jotai";
import { competitionAtom, inscriptionsAtom } from "../../../GlobalsStates";
import { AllInscriptionsSection } from "./AllInscriptionsSection";

/**
 * Main Inscriptions component that displays both user-specific and all inscriptions
 * for a competition. Handles data fetching and layout organization.
 */
export const Inscriptions = () => {
    // Get competition and inscriptions data from global state
    const competition = useAtomValue(competitionAtom);
    const inscriptions = useAtomValue(inscriptionsAtom);
    
    // Validate required data
    if (!competition) throw new Error('No competition found');
    if (!inscriptions) throw new Error('No inscriptions found');

    return (
        <Paper 
            sx={{ 
                width: 'max-content', 
                margin: 'auto', 
                maxWidth: 'calc(100% - 2*min(2rem, 2vw))',
                padding: 'min(2rem, 2vw)'
            }}
        >
            <Stack spacing={3}>
                {/* Display user's inscriptions */}
                <UserInscriptionsSection 
                    competitionEid={competition.eid} 
                    competitionDate={competition.date}
                />

                {/* Display all inscriptions with filtering */}
                <AllInscriptionsSection 
                    competition={competition}
                    inscriptions={inscriptions}
                />
            </Stack>
        </Paper>
    );
};