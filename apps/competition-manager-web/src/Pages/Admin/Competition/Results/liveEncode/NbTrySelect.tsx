import { Select, MenuItem } from '@mui/material'
import { useTranslation } from 'react-i18next'
import { NbTrySelectProps } from './type'


export const NbTrySelect: React.FC<NbTrySelectProps> = ({
    trySelector,
    handleTrySelectorChange
}) => {
    const { t } = useTranslation()
    return (
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
    )
}

