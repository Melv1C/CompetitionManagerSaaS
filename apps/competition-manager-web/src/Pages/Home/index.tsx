import { useTranslation } from "react-i18next";
import { Logo, MaxWidth } from "../../Components";
import { Box, Button, Stack, Typography } from "@mui/material";
import { useNavigate } from "react-router-dom";

export const Home = () => {
    const { t } = useTranslation('home');
    const navigate = useNavigate();

    return (
        <MaxWidth>
            <Box sx={{ py: 6 }}>
                <Stack direction={{ xs: "column", md: "row" }} alignItems="center" spacing={4}>
                    {/* Texte à gauche */}
                    <Box flex={1} textAlign={{ xs: "center", md: "left" }}>
                        <Typography variant="h3" fontWeight={700} gutterBottom>
                            {t("title")}
                        </Typography>
                        <Typography variant="h6" color="text.secondary" gutterBottom>
                            {t("description")}
                        </Typography>
                        <Stack direction="row" spacing={2} justifyContent={{ xs: "center", md: "flex-start" }}>
                            <Button variant="contained" color="primary" onClick={() => navigate('/competitions')}>
                                {t("viewCalendar")}
                            </Button>
                            <Button variant="outlined" color="primary" onClick={() => navigate('/competitions?isPast=true')}>
                                {t("viewResults")}
                            </Button>
                        </Stack>
                    </Box>

                    {/* Logo à droite */}
                    <Box flex={1} display="flex" justifyContent="center">
                        <Logo color="black" sx={{ height: '20rem' }} />
                    </Box>
                </Stack>
            </Box>
        </MaxWidth>
    );
};
