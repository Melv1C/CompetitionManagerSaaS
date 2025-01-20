import { useTranslation } from "react-i18next";
import { MaxWidth } from "../../Components"
import { Typography } from "@mui/material";

export const Home = () => {

    const { t } = useTranslation();

    return (
        <MaxWidth>
            <Typography variant="h4">{t('navigation:home')}</Typography>
        </MaxWidth>
    )
}
