/**
 * File: apps/competition-manager-web/src/Pages/Admin/Competition/Results/index.tsx
 *
 * Description: Main Results page component for competition administration.
 * Displays competition information and provides access to result upload functionality.
 */

import { MaxWidth } from '@/Components';
import { competitionAtom } from '@/GlobalsStates';
import { Box, Paper, Typography } from '@mui/material';
import { useAtomValue } from 'jotai';
import { useTranslation } from 'react-i18next';
import { FileUpload } from './FileUpload';
import { Encoding } from './Encoding';

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

    return (
        <MaxWidth
            sx={{
                display: 'flex',
                flexDirection: 'column',
                gap: 2,
            }}
            maxWidth="lg"
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

                    <FileUpload />
                </Box>
            </Paper>

            <Encoding />
        </MaxWidth>
    );
};
