import { Logo, MaxWidth } from '@/Components';
import { useDeviceSize } from '@/hooks';
import { Box, Button, Stack, Typography } from '@mui/material';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';

export const Home = () => {
    const { t } = useTranslation('home');
    const navigate = useNavigate();

    const { isMobile, isTablet } = useDeviceSize();

    const isSmall = isMobile || isTablet;

    return (
        <MaxWidth>
            <Box sx={{ py: 8 }}>
                <Stack
                    direction={isSmall ? 'column' : 'row'}
                    spacing={isSmall ? 4 : 8}
                    alignItems="center"
                >
                    {/* Texte à gauche */}
                    <Box flex={1} textAlign={isSmall ? 'center' : 'left'}>
                        <Typography
                            variant={isSmall ? 'h4' : 'h2'}
                            fontWeight="Bold"
                            gutterBottom
                        >
                            {t('title')}
                        </Typography>
                        <Typography
                            variant={isSmall ? 'body1' : 'h5'}
                            gutterBottom
                            color="text.secondary"
                        >
                            {t('description')}
                        </Typography>
                        <Stack
                            direction="row"
                            spacing={2}
                            justifyContent={isSmall ? 'center' : 'flex-start'}
                        >
                            <Button
                                variant="contained"
                                color="primary"
                                onClick={() => navigate('/competitions')}
                                sx={{ fontSize: isSmall ? '0.75rem' : '1rem' }}
                            >
                                {t('viewCalendar')}
                            </Button>
                            <Button
                                variant="outlined"
                                color="primary"
                                onClick={() =>
                                    navigate('/competitions?isPast=true')
                                }
                                sx={{ fontSize: isSmall ? '0.75rem' : '1rem' }}
                            >
                                {t('viewResults')}
                            </Button>
                        </Stack>
                    </Box>

                    {/* Logo à droite */}
                    {!isSmall && (
                        <Box flex={1} display="flex" justifyContent="center">
                            <Logo
                                color="black"
                                sx={{ width: '100%', maxWidth: 400 }}
                            />
                        </Box>
                    )}
                </Stack>
            </Box>
        </MaxWidth>
    );
};
