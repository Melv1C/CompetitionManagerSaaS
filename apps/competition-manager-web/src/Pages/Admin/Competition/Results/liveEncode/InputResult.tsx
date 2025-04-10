import { useTranslation } from 'react-i18next';
import { Box, TextField } from '@mui/material';
import { InputResultProps } from './type';
import { KeyboardEvent } from 'react';


export const InputResult: React.FC<InputResultProps> = ({
    inscription,
    tryIndex,
    rowIndex,
    results,
    handleKeyPress,
    handleInputFocus,
    inputMode,
    handleWindKeyPress,
    handleResultChange,
    handleWindChange,
}) => {
    const { t } = useTranslation();

    return (
        <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 1 }}>
            <TextField
                id={`result-${inscription.id}-${tryIndex}`}
                variant="outlined"
                size="small"
                value={results[inscription.id]?.tries[tryIndex] || ''}
                onChange={(e) => handleResultChange(inscription.id.toString(), tryIndex, e.target.value)}
                onKeyDown={(e) => handleKeyPress(e as KeyboardEvent<HTMLInputElement>, tryIndex, rowIndex, inscription.id.toString())}
                onFocus={(e) => handleInputFocus(e as React.FocusEvent<HTMLInputElement>, `result-${inscription.id}-${tryIndex}`)}
                inputProps={{ 
                    style: { textAlign: 'center' },
                    'aria-label': `Try ${tryIndex + 1} for ${inscription.athlete.firstName} ${inscription.athlete.lastName}`
                }}
                sx={{ 
                    width: '80px',
                    display: inputMode === 'wind' ? 'none' : 'block', // Hide if only wind is selected
                    '& .MuiInputBase-root': { height: '36px' }
                }}
            />
            {inputMode != 'perf' && (
                <TextField
                    id={`wind-${inscription.id}-${tryIndex}`}
                    variant="outlined"
                    size="small"
                    placeholder={t('Wind')}
                    value={results[inscription.id]?.wind?.[tryIndex] || ''}
                    onChange={(e) => handleWindChange(inscription.id.toString(), tryIndex, e.target.value)}
                    onKeyDown={(e) => handleWindKeyPress(e as KeyboardEvent<HTMLInputElement>, tryIndex, rowIndex)}
                    onFocus={(e) => handleInputFocus(e as React.FocusEvent<HTMLInputElement>, `wind-${inscription.id}-${tryIndex}`)}
                    inputProps={{ 
                        style: { textAlign: 'center' },
                        'aria-label': `Wind for try ${tryIndex + 1} for ${inscription.athlete.firstName} ${inscription.athlete.lastName}`
                    }}
                    sx={{ 
                        width: '80px',
                        '& .MuiInputBase-root': { height: '28px' }
                    }}
                />
            )}
        </Box>
    )
}





