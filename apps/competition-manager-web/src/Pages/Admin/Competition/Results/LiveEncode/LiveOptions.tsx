import { TextField, Box, FormControl, InputLabel, MenuItem, Select, SelectChangeEvent } from "@mui/material";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { LiveOptionsProps } from "./type";


export const LiveOptions:  React.FC<LiveOptionsProps> = ({
    setNbTry,
    inputMode,
    setInputMode,
}) => {
    const { t } = useTranslation();
    const [trySelector, setTrySelector] = useState<string>("6");
    const [nbTryTemp, setNbTryTemp] = useState(6);
    const [isCustomTry, setIsCustomTry] = useState(false);

    const handleTrySelectorChange = (event: SelectChangeEvent<string>) => {
        const value = event.target.value;
        setTrySelector(value);
        
        if (value === "custom") {
            setIsCustomTry(true);
            // Don't update nbTry yet, wait for custom input
        } else {
            setIsCustomTry(false);
            const tryCount = parseInt(value);
            setNbTry(tryCount);
        }
    };

    // Handle custom try count input
    const handleCustomTryChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setNbTryTemp(parseInt(event.target.value));
        const tryCount = parseInt(event.target.value);
        if (!isNaN(tryCount) && tryCount > 0 && tryCount <= 20) {
            setNbTry(tryCount);
        }
    };

    

    return (
        /* Try count selector, Wind switch, and Virtual Keyboard switch */
        <Box sx={{ marginBottom: '20px', display: 'flex', alignItems: 'center', gap: 2 , justifyContent: 'center'}}>
            <FormControl variant="outlined" size="small" sx={{ width: '150px' }}>
                <InputLabel id="try-count-select-label">{t('Number of Tries')}</InputLabel>
                <Select
                    labelId="try-count-select-label"
                    id="try-count-select"
                    value={trySelector}
                    onChange={handleTrySelectorChange}
                    label={t('Number of Tries')}
                >
                    <MenuItem value="3">3</MenuItem>
                    <MenuItem value="6">6</MenuItem>
                    <MenuItem value="custom">{t('Custom')}</MenuItem>
                </Select>
            </FormControl>
            
            {isCustomTry && (
                <TextField
                    type="number"
                    slotProps={{
                        htmlInput: { 
                            max: 100, 
                            min: 1 
                        },
                    }}
                    label={t('Custom tries')}
                    value={nbTryTemp}
                    onChange={handleCustomTryChange}
                    variant="outlined"
                    size="small"
                />
            )}
            
            <FormControl variant="outlined" size="small" sx={{ width: '200px' }}>
                <InputLabel id="input-mode-select-label">{t('Input Mode')}</InputLabel>
                <Select
                    labelId="input-mode-select-label"
                    id="input-mode-select"
                    value={inputMode}
                    onChange={(e) => setInputMode(e.target.value as 'value' | 'wind' | 'both')}
                    label={t('Input Mode')}
                >
                    <MenuItem value="value">{t('Only Value')}</MenuItem>
                    <MenuItem value="wind">{t('Only Wind')}</MenuItem>
                    <MenuItem value="both">{t('Both')}</MenuItem>
                </Select>
            </FormControl>
        </Box>
    )
}