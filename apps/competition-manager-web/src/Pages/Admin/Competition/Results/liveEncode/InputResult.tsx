import { Box, TextField } from '@mui/material';
import { KeyboardEvent } from 'react';
import { useTranslation } from 'react-i18next';
import { InputResultProps } from './type';

export const InputResult: React.FC<InputResultProps> = ({
    resultId,
    tryNumber,
    resultDetail,
    inputMode,
    handleChange,
    handleKeyPress,
    handleInputFocus,
    handleWindKeyPress,
    currentInput,
    handleBlur
}) => {
    const { t } = useTranslation();

    return (
        <Box
            sx={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: 1,
            }}
        >
            <TextField
                id={`result-${resultId}-${tryNumber}`}
                variant="outlined"
                size="small"
                value={
                    currentInput?.resultId === resultId &&
                    currentInput?.tryNumber === tryNumber &&
                    currentInput?.type === 'value'
                        ? currentInput.value
                        : resultDetail?.value || ''
                }
                onChange={(e) => handleChange(e.target.value)}
                onKeyDown={(e) =>
                    handleKeyPress(
                        e as KeyboardEvent<HTMLInputElement>,
                        resultId,
                        tryNumber
                    )
                }
                onFocus={() => handleInputFocus(resultId, tryNumber, 'value')}
                inputProps={{
                    style: { textAlign: 'center' },
                }}
                sx={{
                    width: '80px',
                    display: inputMode === 'wind' ? 'none' : 'block', // Hide if only wind is selected
                    '& .MuiInputBase-root': { height: '36px' },
                }}
                onBlur={() => {
                    handleBlur(resultId);
                }}
            />
            {inputMode != 'value' && (
                <TextField
                    id={`wind-${resultId}-${tryNumber}`}
                    variant="outlined"
                    size="small"
                    placeholder={t('Wind')}
                    value={
                        currentInput?.resultId === resultId &&
                        currentInput?.tryNumber === tryNumber &&
                        currentInput?.type === 'wind'
                            ? currentInput.value
                            : resultDetail?.wind || ''
                    }
                    onChange={(e) => handleChange(e.target.value)}
                    onKeyDown={(e) =>
                        handleWindKeyPress(
                            e as KeyboardEvent<HTMLInputElement>,
                            resultId,
                            tryNumber
                        )
                    }
                    onFocus={() =>
                        handleInputFocus(resultId, tryNumber, 'wind')
                    }
                    onClick={() => {
                        const input = document.getElementById(
                            `wind-${resultId}-${tryNumber}`
                        ) as HTMLInputElement;
                        if (input) {
                            const length = input.value.length;
                            input.setSelectionRange(length, length);
                        }
                    }}
                    inputProps={{
                        style: { textAlign: 'center' },
                    }}
                    sx={{
                        width: '80px',
                        '& .MuiInputBase-root': { height: '28px' },
                    }}
                />
            )}
        </Box>
    );
};
