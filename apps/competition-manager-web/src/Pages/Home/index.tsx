import { useTranslation } from "react-i18next";
import { Logo, MaxWidth } from "../../Components";
import { Box, Button, Stack, Typography } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { useDeviceSize } from "../../hooks";

export const Home = () => {
    const { t } = useTranslation('home');
    const navigate = useNavigate();

    const {isMobile} = useDeviceSize();

    return (
        <MaxWidth>
            <Box sx={{ py: 6 }}>
                <Stack direction={isMobile ? "column" : "row"} spacing={isMobile ? 4 : 8} alignItems="center">
                    {/* Texte à gauche */}
                    <Box flex={1} textAlign={isMobile ? "center" : "left"}>
                        <Typography variant="h3" fontWeight={700} gutterBottom>
                            {t("title")}
                        </Typography>
                        <Typography variant="h6" color="text.secondary" gutterBottom>
                            {t("description")}
                        </Typography>
                        <Stack direction="row" spacing={2} justifyContent={isMobile ? "center" : "flex-start"}>
                            <Button variant="contained" color="primary" onClick={() => navigate('/competitions')}>
                                {t("viewCalendar")}
                            </Button>
                            <Button variant="outlined" color="primary" onClick={() => navigate('/competitions?isPast=true')}>
                                {t("viewResults")}
                            </Button>
                        </Stack>
                    </Box>

                    {/* Logo à droite */}
                    {!isMobile && (
                        <Box flex={1} display="flex" justifyContent="center">
                            <Logo color="black" sx={{ width: "100%", maxWidth: 400 }} />
                        </Box>
                    )}
                </Stack>
            </Box>
        </MaxWidth>
    );
};
