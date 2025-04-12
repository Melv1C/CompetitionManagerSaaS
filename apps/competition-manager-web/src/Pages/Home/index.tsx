import { Logo, MaxWidth } from '@/Components';
import { useDeviceSize } from '@/hooks';
import {
    faCalendarAlt,
    faTrophy,
    faUserPlus,
} from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
    Box,
    Button,
    Card,
    Grid,
    Stack,
    Typography,
    useTheme,
} from '@mui/material';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';

export const Home = () => {
    const { t } = useTranslation('home');
    const navigate = useNavigate();
    const theme = useTheme();

    const { isMobile, isTablet } = useDeviceSize();
    const isSmall = isMobile || isTablet;

    const MotionBox = motion(Box);
    const MotionTypography = motion(Typography);
    const MotionCard = motion(Card);

    // Feature card data - Removed Performance Analytics as requested
    const features = [
        {
            icon: (
                <FontAwesomeIcon
                    icon={faCalendarAlt}
                    size="2x"
                    color={theme.palette.primary.main}
                />
            ),
            title: t('features.calendar.title', 'Schedule Competitions'),
            description: t(
                'features.calendar.description',
                'Easily manage and view upcoming athletic events and competitions.'
            ),
        },
        {
            icon: (
                <FontAwesomeIcon
                    icon={faUserPlus}
                    size="2x"
                    color={theme.palette.primary.main}
                />
            ),
            title: t('features.registration.title', 'Simple Registration'),
            description: t(
                'features.registration.description',
                'Streamlined process for athletes to register for events.'
            ),
        },
        {
            icon: (
                <FontAwesomeIcon
                    icon={faTrophy}
                    size="2x"
                    color={theme.palette.primary.main}
                />
            ),
            title: t('features.results.title', 'Live Results'),
            description: t(
                'features.results.description',
                'Real-time competition results available to participants and spectators.'
            ),
        },
    ];

    return (
        <Box sx={{ bgcolor: 'background.default' }}>
            {/* Hero section - Reduced size and improved spacing */}
            <Box
                sx={{
                    background: `linear-gradient(135deg, ${theme.palette.primary.light} 0%, ${theme.palette.primary.main} 100%)`,
                    color: 'white',
                    py: isSmall ? 4 : 6, // Reduced vertical padding
                    mb: 6,
                }}
            >
                <MaxWidth>
                    <Grid
                        container
                        spacing={3}
                        alignItems="center"
                        justifyContent="space-between"
                    >
                        <Grid item xs={12} md={6}>
                            <MotionBox
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.8 }}
                            >
                                <Typography
                                    variant={isSmall ? 'h4' : 'h3'} // Reduced from h3/h1 to h4/h3
                                    component="h1"
                                    fontWeight="800"
                                    gutterBottom
                                >
                                    {t('title')}
                                </Typography>

                                <Typography
                                    variant={isSmall ? 'body2' : 'body1'} // Reduced from body1/h6 to body2/body1
                                    sx={{ mb: 3, opacity: 0.9 }} // Reduced margin bottom
                                >
                                    {t('description')}
                                </Typography>

                                <Stack
                                    direction={isSmall ? 'column' : 'row'}
                                    spacing={2}
                                >
                                    <Button
                                        variant="contained"
                                        size="large"
                                        color="secondary"
                                        onClick={() =>
                                            navigate('/competitions')
                                        }
                                        sx={{
                                            py: 1, // Reduced padding
                                            px: 3,
                                            fontWeight: 'bold',
                                            boxShadow: theme.shadows[4],
                                            '&:hover': {
                                                transform: 'translateY(-3px)',
                                                boxShadow: theme.shadows[8],
                                            },
                                            transition:
                                                'transform 0.3s, box-shadow 0.3s',
                                        }}
                                    >
                                        {t('viewCalendar')}
                                    </Button>

                                    <Button
                                        variant="outlined"
                                        size="large"
                                        onClick={() =>
                                            navigate(
                                                '/competitions?isPast=true'
                                            )
                                        }
                                        sx={{
                                            py: 1, // Reduced padding
                                            px: 3,
                                            color: 'white',
                                            borderColor: 'white',
                                            '&:hover': {
                                                borderColor: 'white',
                                                backgroundColor:
                                                    'rgba(255, 255, 255, 0.1)',
                                            },
                                        }}
                                    >
                                        {t('viewResults')}
                                    </Button>
                                </Stack>
                            </MotionBox>
                        </Grid>

                        <Grid
                            item
                            xs={12}
                            md={5}
                            sx={{
                                display: { xs: 'none', md: 'flex' },
                                justifyContent: 'center',
                                alignItems: 'center',
                            }}
                        >
                            <MotionBox
                                initial={{ opacity: 0, x: 50 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ duration: 0.8, delay: 0.2 }}
                                sx={{
                                    display: 'flex',
                                    justifyContent: 'center',
                                }}
                            >
                                <Logo
                                    color="white"
                                    sx={{
                                        width: '100%',
                                        maxWidth: 350, // Slightly reduced logo size
                                        filter: 'drop-shadow(0px 4px 8px rgba(0, 0, 0, 0.2))',
                                    }}
                                />
                            </MotionBox>
                        </Grid>
                    </Grid>
                </MaxWidth>
            </Box>

            {/* Features section */}
            <MaxWidth>
                <Box sx={{ mb: 8 }}>
                    <MotionTypography
                        variant="h4"
                        textAlign="center"
                        fontWeight="bold"
                        sx={{ mb: 6 }}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5 }}
                    >
                        {t('features.title', 'Powerful Competition Management')}
                    </MotionTypography>

                    <Grid container spacing={3} justifyContent="center">
                        {features.map((feature, index) => (
                            <Grid item xs={12} sm={6} md={4} key={index}>
                                <MotionCard
                                    initial={{ opacity: 0, y: 30 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{
                                        duration: 0.5,
                                        delay: 0.1 * index,
                                    }}
                                    sx={{
                                        height: '100%',
                                        p: 3,
                                        display: 'flex',
                                        flexDirection: 'column',
                                        alignItems: 'center',
                                        textAlign: 'center',
                                        boxShadow: 2,
                                        '&:hover': {
                                            boxShadow: 6,
                                            transform: 'translateY(-5px)',
                                        },
                                        transition:
                                            'transform 0.3s, box-shadow 0.3s',
                                    }}
                                >
                                    <Box sx={{ mb: 2 }}>{feature.icon}</Box>
                                    <Typography
                                        variant="h6"
                                        component="h3"
                                        fontWeight="bold"
                                        gutterBottom
                                    >
                                        {feature.title}
                                    </Typography>
                                    <Typography
                                        variant="body2"
                                        color="text.secondary"
                                    >
                                        {feature.description}
                                    </Typography>
                                </MotionCard>
                            </Grid>
                        ))}
                    </Grid>
                </Box>
            </MaxWidth>

            {/* Testimonial section - Temporarily commented out
            <Box sx={{ bgcolor: theme.palette.grey[50], py: 8, mb: 6 }}>
                <MaxWidth>
                    <MotionBox
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.6 }}
                    >
                        <Paper 
                            elevation={3}
                            sx={{ 
                                p: isSmall ? 3 : 5, 
                                borderRadius: 4,
                                textAlign: 'center',
                                maxWidth: 900,
                                mx: 'auto'
                            }}
                        >
                            <Typography variant="h5" fontStyle="italic" gutterBottom>
                                {t('testimonial.quote', '"This platform has revolutionized how we organize athletic events. Everything from registration to results is seamless."')}
                            </Typography>
                            <Divider sx={{ my: 3, width: '10%', mx: 'auto' }} />
                            <Typography variant="subtitle1" fontWeight="bold">
                                {t('testimonial.author', 'Thomas Laurent')}
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                                {t('testimonial.position', 'Competition Director, LBFA')}
                            </Typography>
                        </Paper>
                    </MotionBox>
                </MaxWidth>
            </Box>
            */}
        </Box>
    );
};
