import { Box, Container, Link, Stack, Typography } from "@mui/material";
import Grid from '@mui/material/Grid2';
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEnvelope } from "@fortawesome/free-solid-svg-icons";
import { faLinkedin } from "@fortawesome/free-brands-svg-icons";

const CONTACT_EMAIL = 'competition.manager.saas@gmail.com';

const DEV_TEAM = [
    { name: 'Claes Melvyn', linkedIn: 'https://www.linkedin.com/in/melvyn-claes-187820225/', email: 'claes.melvyn@gmail.com' },
    { name: 'Claes Riwan', linkedIn: 'https://www.linkedin.com/in/riwan-claes-a13224332/', email: 'riwan.claes@gmail.com' },
];

export const Footer = () => {

    const { t } = useTranslation('footer');

    const navigate = useNavigate();

    return (
        <Box 
            id="footer"
            component="footer" 
            sx={{ 
                bgcolor: "primary.main", 
                color: "primary.contrastText", 
                pt: 4,
                mt: 4,
            }}

        >
            <Container maxWidth="lg">
                <Grid container spacing={4}>
                    {/* Essential Links */}
                    <Grid size={{ xs: 12, sm: 5, md: 3 }}>
                        <Typography variant="h6" fontWeight={600} gutterBottom>
                            {t('essentialLinks')}
                        </Typography>
                        <Stack spacing={1}>
                            <Link onClick={() => navigate('/')} color="inherit" sx={{ cursor: 'pointer' }}>
                                {t('navigation:home')}
                            </Link>
                            <Link onClick={() => navigate('/competitions')} color="inherit" sx={{ cursor: 'pointer' }}>
                                {t('navigation:calendar')}
                            </Link>
                            <Link onClick={() => navigate('/competitions?isPast=true')} color="inherit" sx={{ cursor: 'pointer' }}>
                                {t('glossary:results')}
                            </Link>
                            <Link onClick={() => navigate('/account')} color="inherit" sx={{ cursor: 'pointer' }}>
                                {t('account')}
                            </Link>
                        </Stack>
                    </Grid>

                    {/* Contact & Support */}
                    <Grid size={{ xs: 12, sm: 7, md: 5 }}>
                        <Typography variant="h6" fontWeight={600} gutterBottom>
                            {t('contactSupport')}
                        </Typography>
                        <Stack spacing={1}>
                            <Link href={`mailto:${CONTACT_EMAIL}`} color="inherit" sx={{ display: 'flex', gap: '0.5rem', cursor: 'pointer' }} underline="none">
                                <FontAwesomeIcon icon={faEnvelope} />
                                {CONTACT_EMAIL}
                            </Link>
                            <Link onClick={() => navigate('/faq')} color="inherit" sx={{ cursor: 'pointer' }}>
                                {t('faq')}
                            </Link>
                        </Stack>
                    </Grid>

                    {/* Development Team */}
                    <Grid size={{ sm: 12, md: 4 }}>
                        <Typography variant="h6" fontWeight={600} gutterBottom>
                            {t('developmentTeam')}
                        </Typography>
                        <Stack spacing={1}>
                            {DEV_TEAM.map((member, index) => (
                                <Box key={index} sx={{ display: 'flex', gap: '0.5rem' }}>
                                    <Typography variant="body2" fontWeight={600} minWidth="100px">
                                        {member.name}
                                    </Typography>
                                    <Stack direction="row" spacing={1}>
                                        <FontAwesomeIcon icon={faLinkedin} onClick={() => window.open(member.linkedIn)} style={{ cursor: 'pointer' }} />
                                        <FontAwesomeIcon icon={faEnvelope} onClick={() => window.open(`mailto:${member.email}`)} style={{ cursor: 'pointer' }} />
                                    </Stack>
                                </Box>
                            ))}
                        </Stack>
                    </Grid>
                </Grid>
            </Container>
            {/* Branding & Copyright */}
            <Box 
                sx={{ 
                    bgcolor: 'primary.dark', 
                    color: 'primary.contrastText',
                    textAlign: 'center',
                    mt: 4, 
                    py: 2 
                }}
            >
                <Typography variant="body2">
                    © {new Date().getFullYear()} Competition Manager. {t('rightsReserved')}
                </Typography>
            </Box>
        </Box>
    );
};
