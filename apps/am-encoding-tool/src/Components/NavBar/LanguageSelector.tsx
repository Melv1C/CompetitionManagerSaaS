import { Language } from "@competition-manager/schemas"
import { MenuItem, Select } from "@mui/material"
import { useTranslation } from "react-i18next"


export const LanguageSelector = () => {

    const { i18n } = useTranslation()

    return (
        <Select
            value={i18n.language}
            onChange={(e) => i18n.changeLanguage(e.target.value)}
            variant="standard"
            sx={{ 
                color: 'inherit',
                '& .MuiSelect-icon': {
                    color: 'inherit',
                },
                '&::before': {
                    borderBottom: 'none',
                },
                '&:hover:before': {
                    borderBottom: 'none !important',
                },
            }}
        >
            <MenuItem value={Language.FR}>{Language.FR.toUpperCase()}</MenuItem>
            <MenuItem value={Language.EN}>{Language.EN.toUpperCase()}</MenuItem>
            <MenuItem value={Language.NL}>{Language.NL.toUpperCase()}</MenuItem>
        </Select>
    )
}
