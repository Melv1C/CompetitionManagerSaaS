/**
 * File: apps/competition-manager-web/src/Pages/FAQ/Components/CantFindAnswer.tsx
 *
 * Component that provides a call-to-action for users who can't find their answers
 * in the FAQ section. This component is displayed at the bottom of the FAQ page
 * and offers a way to contact support.
 *
 * Features:
 * - Visually distinct design to draw attention
 * - Direct email support link
 * - Internationalization support
 * - Consistent styling with the FAQ page using Material-UI Paper
 */

import { faEnvelope } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Button, Paper, Stack, Typography } from '@mui/material';
import { useTranslation } from 'react-i18next';

/**
 * Component that displays a "Can't find your answer?" section with support contact options
 *
 * @component
 * @returns {ReactNode} The rendered CantFindAnswer component
 */
export const CantFindAnswer = () => {
    const { t } = useTranslation('faq');

    return (
        <Paper
            elevation={1}
            sx={{
                mt: 4,
                p: 3,
                textAlign: 'center',
            }}
        >
            <Stack spacing={2} alignItems="center">
                <Typography variant="h6" component="h2">
                    {t('cantFindAnswer.title')}
                </Typography>
                <Typography>{t('cantFindAnswer.description')}</Typography>
                <Button
                    variant="contained"
                    color="primary"
                    startIcon={<FontAwesomeIcon icon={faEnvelope} />}
                    href="mailto:competition.manager.saas@gmail.com"
                    sx={{ mt: 1 }}
                >
                    {t('cantFindAnswer.contactSupport')}
                </Button>
            </Stack>
        </Paper>
    );
};
