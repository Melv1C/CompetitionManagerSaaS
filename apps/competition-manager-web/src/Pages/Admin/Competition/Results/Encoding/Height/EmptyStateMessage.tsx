import { Box, Typography } from '@mui/material';
import { useTranslation } from 'react-i18next';

interface EmptyStateMessageProps {
    noHeights?: boolean;
    noResults?: boolean;
}

export const EmptyStateMessage: React.FC<EmptyStateMessageProps> = ({
    noHeights = false,
    noResults = false,
}) => {
    const { t } = useTranslation();

    if (noResults) {
        return (
            <Box sx={{ p: 3, textAlign: 'center' }}>
                <Typography variant="body1" color="text.secondary">
                    {t('result:noResultsAvailable')}
                </Typography>
            </Box>
        );
    }

    if (noHeights) {
        return (
            <Box sx={{ textAlign: 'center', p: 3 }}>
                <Typography variant="body1" color="text.secondary">
                    {t('result:noHeights')}
                </Typography>
                <Typography
                    variant="body2"
                    color="text.secondary"
                    sx={{ mt: 1 }}
                >
                    {t('result:addHeightInstruction')}
                </Typography>
            </Box>
        );
    }

    return null;
};
