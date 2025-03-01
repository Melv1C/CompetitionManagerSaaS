import { faEnvelope, faRotate } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Box, Button, Paper, Typography } from '@mui/material';
import { FallbackProps } from 'react-error-boundary';
import { useTranslation } from 'react-i18next';
import { MaxWidth } from './MaxWidth';
import { isNodeEnv } from '@/env';
import { NODE_ENV } from '@competition-manager/schemas';

export const ErrorFallback: React.FC<FallbackProps> = ({
    error,
    resetErrorBoundary,
}) => {
    const { t } = useTranslation('errors');

    const handleReload = () => {
        // Reset the error boundary which will attempt to re-render the component tree
        resetErrorBoundary();
        // Also reload the page if needed
        window.location.reload();
    };

    return (
        <MaxWidth>
            <Paper elevation={3} sx={{ p: 4, mt: 4, textAlign: 'center' }}>
                <Typography variant="h4" color="error" gutterBottom>
                    {t('errorFallback.title')}
                </Typography>

                <Typography variant="body1" component='p' gutterBottom>
                    {t('errorFallback.description')}
                </Typography>

                {!isNodeEnv(NODE_ENV.PROD) && (
                    <Typography
                        variant="body2"
                        color="text.secondary"
                        sx={{
                            mb: 3,
                            p: 2,
                            backgroundColor: 'rgba(0,0,0,0.05)',
                            borderRadius: 1,
                        }}
                    >
                        {error.message}
                    </Typography>
                )}

                <Box
                    sx={{
                        display: 'flex',
                        justifyContent: 'center',
                        gap: 2,
                        mt: 3,
                    }}
                >
                    <Button
                        variant="contained"
                        color="primary"
                        onClick={handleReload}
                        startIcon={<FontAwesomeIcon icon={faRotate} />}
                    >
                        {t('errorFallback.reload')}
                    </Button>

                    <Button
                        variant="outlined"
                        href="mailto:competition.manager.saas@gmail.com"
                        startIcon={<FontAwesomeIcon icon={faEnvelope} />}
                    >
                        {t('errorFallback.contact')}
                    </Button>
                </Box>

                <Typography
                    variant="caption"
                    sx={{ display: 'block', mt: 3 }}
                    color="text.secondary"
                >
                    {t('errorFallback.persistentError')}
                </Typography>
            </Paper>
        </MaxWidth>
    );
};
