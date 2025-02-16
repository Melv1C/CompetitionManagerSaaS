import { Alert, Button, DialogActions, DialogContent, DialogTitle, Typography } from "@mui/material";
import { useTranslation } from "react-i18next";
import { NewsProps } from ".";
import { LanguageSelector } from "../NavBar/LanguageSelector";

export const Welcom: React.FC<NewsProps> = ({ handleClose }) => {

    const { t } = useTranslation('news');

    return (
        <>
            <DialogTitle 
                sx={{ 
                    display: 'flex', 
                    flexDirection: 'row', 
                    justifyContent: 'space-between', 
                    alignItems: 'center',
                    fontWeight: 'bold',
                    fontSize: '1.5rem',
                }}
            >
                {t("welcome.title")}
                <LanguageSelector />
            </DialogTitle>
            <DialogContent sx={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                <Typography>
                    {t("welcome.intro")}
                </Typography>
                <Alert severity="info">
                    {t("welcome.authChange")}
                </Alert>
                <Typography sx={{ fontStyle: 'italic' }}>
                    {t("welcome.thankYou")}
                </Typography>
            </DialogContent>
            <DialogActions>
                <Button onClick={handleClose} variant="contained" color="primary" size="large" sx={{ width: '100%', borderRadius: 2 }}>
                    {t("buttons:close")}
                </Button>
            </DialogActions>
        </>
    )
}
