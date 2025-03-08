/**
 * File: apps/competition-manager-web/src/Pages/Admin/Competition/Results/index.tsx
 *
 * Description: Main Results page component for competition administration.
 * Displays competition information and provides access to result upload functionality.
 */

import { MaxWidth } from '@/Components';
import { competitionAtom } from '@/GlobalsStates';
import {
    faArrowUpFromBracket
} from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Box, IconButton, Paper, Tooltip, Typography } from '@mui/material';
import { useAtomValue } from 'jotai';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { FilePopup } from './FilePopup';

/**
 * Results page component for managing competition results
 *
 * @returns React component displaying the competition results interface
 */
export const Results = () => {
    const { t } = useTranslation();

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
            {/* Header section with competition info */}
            <Paper elevation={1} sx={{ p: 2, mb: 2 }}>
                <Box
                    sx={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                    }}
                >
                    <Box>
                        <Typography variant="h5">{competition.name}</Typography>
                        <Typography variant="body2" color="text.secondary">
                            {t('result:resultsManagement')}
                        </Typography>
                    </Box>

                    {/* Upload button with tooltip */}
                    <Tooltip title={t('result:uploadResults')}>
                        <IconButton
                            onClick={() => setFilePopupVisible(true)}
                            color="primary"
                            size="large"
                        >
                            <FontAwesomeIcon icon={faArrowUpFromBracket} />
                        </IconButton>
                    </Tooltip>
                    {/* File upload popup */}
                    {filePopupVisible && (
                        <FilePopup
                            open={filePopupVisible}
                            onClose={() => setFilePopupVisible(false)}
                        />
                    )}
                </Box>
            </Paper>
        </MaxWidth>
    );
};
