/**
 * File: apps/competition-manager-web/src/Pages/Admin/Competition/Results/index.tsx
 *
 * Description: Main Results page component for competition administration.
 * Displays competition information and provides access to result upload functionality.
 */

import { MaxWidth } from '@/Components';
import { competitionAtom } from '@/GlobalsStates';
import { faArrowUpFromBracket } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Box, Divider, IconButton, Typography } from '@mui/material';
import { useAtomValue } from 'jotai';
import { useState } from 'react';
import { FilePopup } from './FilePopup';

/**
 * Results page component for managing competition results
 *
 * @returns React component displaying the competition results interface
 */
export const Results = () => {
    // Get competition data from global state
    const competition = useAtomValue(competitionAtom);
    if (!competition) throw new Error('No competition data found');

    // State for managing file upload popup visibility
    const [filePopupVisible, setFilePopupVisible] = useState(false);

    return (
        <MaxWidth
            sx={{
                display: 'flex',
                flexDirection: 'column',
                gap: 2,
            }}
        >
            <Box
                sx={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                }}
            >
                {/* Competition name heading */}
                <Typography variant="h5">{competition.name}</Typography>

                {/* Upload button to trigger file popup */}
                <IconButton
                    onClick={() => setFilePopupVisible(true)}
                    color="primary"
                >
                    <FontAwesomeIcon icon={faArrowUpFromBracket} />
                </IconButton>
                {filePopupVisible && (
                    <FilePopup
                        open={filePopupVisible}
                        onClose={() => setFilePopupVisible(false)}
                    />
                )}
            </Box>

            <Divider />
        </MaxWidth>
    );
};
