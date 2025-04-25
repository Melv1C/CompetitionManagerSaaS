import {
    EventType,
    Id,
    ResultDetail,
    ResultDetailCode,
} from '@competition-manager/schemas';
import { formatPerf } from '@competition-manager/utils';
import { Box, TextField } from '@mui/material';
import { ChangeEvent, KeyboardEvent, useEffect, useRef } from 'react';

interface InputResultDistanceProps {
    resultId: Id;
    tryNumber: number;
    resultDetail: ResultDetail | undefined;
    handleInputFocus: (resultId: Id, tryNumber: number) => void;
    currentInput: {
        resultId: Id;
        tryNumber: number;
        value: string;
    };
    onInputChange: (value: string) => void;
    onEnterKeyPress?: () => void;
    onInputBlur?: () => void;
    // New prop to determine if this input should be disabled
    isDisabled?: boolean;
    // New prop to determine if the input should be readOnly based on device
    isMobileDevice?: boolean;
}

export const InputResultDistance: React.FC<InputResultDistanceProps> = ({
    resultId,
    tryNumber,
    resultDetail,
    handleInputFocus,
    currentInput,
    onInputChange,
    onEnterKeyPress,
    onInputBlur,
    isDisabled = false,
    isMobileDevice = false,
}) => {
    const inputRef = useRef<HTMLInputElement>(null);

    // Format the display value
    const getDisplayValue = () => {
        // If this is the current input being edited, show the current input value
        if (
            currentInput?.resultId === resultId &&
            currentInput?.tryNumber === tryNumber
        ) {
            switch (parseInt(currentInput.value)) {
                case ResultDetailCode.X:
                    return 'X';
                case ResultDetailCode.PASS:
                    return '-';
                case ResultDetailCode.R:
                    return 'r';
                default:
                    return currentInput.value;
            }
        }

        // If there's no result detail, return empty string
        if (!resultDetail) {
            return '';
        }

        // Handle special codes first
        if (resultDetail.value === ResultDetailCode.X) {
            return 'X';
        } else if (resultDetail.value === ResultDetailCode.PASS) {
            return '-';
        } else if (resultDetail.value === ResultDetailCode.R) {
            return 'r';
        }

        // Format numeric value
        return formatPerf(resultDetail.value || 0, EventType.DISTANCE);
    };

    // Handle keyboard interaction for direct physical keyboard input
    const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
        if (isDisabled) return;

        if (e.key === 'Enter') {
            e.preventDefault(); // Prevent default form submission behavior
            if (inputRef.current) {
                inputRef.current.blur();
            }
            if (onEnterKeyPress) {
                onEnterKeyPress();
            }
        }
    };

    // Handle direct keyboard input
    const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
        if (isDisabled) return;

        // Only process input if this field is currently focused
        if (
            currentInput?.resultId === resultId &&
            currentInput?.tryNumber === tryNumber
        ) {
            const newValue = e.target.value;

            // Handle special characters (X, -, r)
            if (newValue === 'X' || newValue === '-' || newValue === 'r') {
                onInputChange(newValue);
                return;
            }

            // If the input starts with a special character, don't allow additional input
            if (
                newValue.startsWith('X') ||
                newValue.startsWith('-') ||
                newValue.startsWith('r')
            ) {
                onInputChange(newValue.charAt(0));
                return;
            }

            // For numeric inputs, allow only numbers and decimal point
            const validInput = newValue.replace(/[^0-9.]/g, '');
            onInputChange(validInput);
        }
    };

    // Handle blur event
    const handleBlur = () => {
        if (isDisabled) return;

        if (
            currentInput?.resultId === resultId &&
            currentInput?.tryNumber === tryNumber &&
            onInputBlur
        ) {
            onInputBlur();
        }
    };

    // Position cursor at the end of input when focused
    const handleClick = () => {
        if (isDisabled) return;

        if (inputRef.current) {
            const length = inputRef.current.value.length;
            inputRef.current.setSelectionRange(length, length);
        }
    };

    // Focus the input when it becomes the current input
    useEffect(() => {
        if (
            !isDisabled &&
            currentInput?.resultId === resultId &&
            currentInput?.tryNumber === tryNumber &&
            inputRef.current &&
            document.activeElement !== inputRef.current
        ) {
            inputRef.current.focus();
            handleClick();
        }
    }, [currentInput, resultId, tryNumber, isDisabled]);

    // Check if this is the current input being edited
    const isCurrentInput =
        currentInput?.resultId === resultId &&
        currentInput?.tryNumber === tryNumber;

    return (
        <Box>
            <TextField
                id={`distance-result-${resultId}-${tryNumber}`}
                inputRef={inputRef}
                variant="outlined"
                size="small"
                value={getDisplayValue()}
                onChange={handleChange}
                onFocus={() =>
                    !isDisabled && handleInputFocus(resultId, tryNumber)
                }
                onBlur={handleBlur}
                onClick={handleClick}
                onKeyDown={handleKeyDown}
                disabled={isDisabled}
                // Set readOnly dynamically based on device type
                InputProps={{
                    readOnly: isMobileDevice,
                }}
                inputProps={{
                    style: {
                        textAlign: 'center',
                        fontWeight:
                            resultDetail?.value === ResultDetailCode.X ||
                            resultDetail?.value === ResultDetailCode.PASS ||
                            resultDetail?.value === ResultDetailCode.R
                                ? 'bold'
                                : 'normal',
                    },
                }}
                sx={{
                    width: '90px',
                    transition: 'all 0.2s ease-in-out',
                    // Only remove the default focus outline/state
                    '& .MuiOutlinedInput-root.Mui-focused .MuiOutlinedInput-notchedOutline':
                        {
                            // Remove only the default MUI focus outline
                            borderColor: 'rgba(0, 0, 0, 0.23)', // Use the default border color
                            borderWidth: '1px', // Reset to default border width
                        },
                    '& .MuiInputBase-root': {
                        height: '36px',
                        transition: 'all 0.2s ease-in-out',
                        borderRadius: '8px',
                        // Enhanced current input styling
                        ...(isCurrentInput && {
                            transform: 'scale(1.05)',
                            boxShadow: '0 0 8px 2px rgba(25, 118, 210, 0.4)',
                            border: '2px solid #1976d2',
                            animation: 'pulse 1.5s infinite ease-in-out',
                            zIndex: 10,
                            position: 'relative',
                        }),
                        // Disabled styling
                        ...(isDisabled && {
                            backgroundColor: 'rgba(0, 0, 0, 0.12)',
                            color: 'rgba(0, 0, 0, 0.38)',
                            boxShadow: 'none',
                            border: '1px solid rgba(0, 0, 0, 0.23)',
                            pointerEvents: 'none',
                        }),
                        // Special cases styling
                        ...(resultDetail?.value === ResultDetailCode.X && {
                            boxShadow: '0 0 0 1px #f44336',
                            border: '1px solid #f44336',
                            background:
                                'linear-gradient(rgba(244, 67, 54, 0.08), rgba(244, 67, 54, 0.12))',
                        }),
                        ...(resultDetail?.value === ResultDetailCode.PASS && {
                            boxShadow: '0 0 0 1px #2196f3', // Changed to blue (info color)
                            border: '1px solid #2196f3',
                            background:
                                'linear-gradient(rgba(33, 150, 243, 0.08), rgba(33, 150, 243, 0.12))',
                        }),
                        // Changed color for 'r' to warning (amber/orange)
                        ...(resultDetail?.value === ResultDetailCode.R && {
                            boxShadow: '0 0 0 1px #ff9800',
                            border: '1px solid #ff9800',
                            background:
                                'linear-gradient(rgba(255, 152, 0, 0.08), rgba(255, 152, 0, 0.12))',
                        }),
                        // Success styling for normal performance values
                        ...(resultDetail?.value !== undefined &&
                            resultDetail.value !== ResultDetailCode.X &&
                            resultDetail.value !== ResultDetailCode.PASS &&
                            resultDetail.value !== ResultDetailCode.R && {
                                boxShadow: '0 0 0 1px #4caf50',
                                border: '1px solid #4caf50',
                                background:
                                    'linear-gradient(rgba(76, 175, 80, 0.08), rgba(76, 175, 80, 0.12))',
                            }),
                    },
                    '@keyframes pulse': {
                        '0%': {
                            boxShadow: '0 0 0 0 rgba(25, 118, 210, 0.5)',
                        },
                        '70%': {
                            boxShadow: '0 0 0 8px rgba(25, 118, 210, 0)',
                        },
                        '100%': {
                            boxShadow: '0 0 0 0 rgba(25, 118, 210, 0)',
                        },
                    },
                    '& .MuiOutlinedInput-notchedOutline': {
                        // Only remove if a specific resultDetail condition is met
                        ...(resultDetail?.value !== undefined
                            ? {
                                  border: 'none',
                              }
                            : {}),
                    },
                    '&:hover .MuiInputBase-root': {
                        // Don't change hover for disabled inputs
                        ...(isDisabled
                            ? {}
                            : {
                                  // Hover styles for special cases
                                  ...(resultDetail?.value ===
                                      ResultDetailCode.X && {
                                      background:
                                          'linear-gradient(rgba(244, 67, 54, 0.12), rgba(244, 67, 54, 0.18))',
                                  }),
                                  ...(resultDetail?.value ===
                                      ResultDetailCode.PASS && {
                                      background:
                                          'linear-gradient(rgba(33, 150, 243, 0.12), rgba(33, 150, 243, 0.18))',
                                  }),
                                  // Change hover color for 'r' to warning
                                  ...(resultDetail?.value ===
                                      ResultDetailCode.R && {
                                      background:
                                          'linear-gradient(rgba(255, 152, 0, 0.12), rgba(255, 152, 0, 0.18))',
                                  }),
                                  // Hover style for normal performance values
                                  ...(resultDetail?.value !== undefined &&
                                      resultDetail.value !==
                                          ResultDetailCode.X &&
                                      resultDetail.value !==
                                          ResultDetailCode.PASS &&
                                      resultDetail.value !==
                                          ResultDetailCode.R && {
                                          background:
                                              'linear-gradient(rgba(76, 175, 80, 0.12), rgba(76, 175, 80, 0.18))',
                                      }),
                              }),
                    },
                }}
            />
        </Box>
    );
};
