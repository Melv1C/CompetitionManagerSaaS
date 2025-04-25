import { AttemptValue, Id, ResultDetail } from '@competition-manager/schemas';
import { Box, TextField } from '@mui/material';
import { ChangeEvent, KeyboardEvent, useEffect, useRef } from 'react';
import { canAddMoreAttempts } from './utils';

interface InputResultHeightProps {
    resultId: Id;
    height: number;
    resultDetail: ResultDetail | undefined;
    handleInputFocus: (resultId: Id, height: number) => void;
    currentInput: {
        resultId: Id;
        height: number;
    };
    onInputChange: (value: string) => void;
    onEnterKeyPress?: () => void;
    onInputBlur?: () => void;
    isDisabled?: boolean;
    isMobileDevice?: boolean;
}

export const InputResultHeight: React.FC<InputResultHeightProps> = ({
    resultId,
    height,
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

    const relaxedIsDisabled =
        isDisabled &&
        (!resultDetail?.attempts || resultDetail?.attempts?.length === 0);

    // Format the display value
    const getDisplayValue = () => {
        // If there's no result detail, return empty string
        if (!resultDetail || !resultDetail.attempts) {
            return '';
        }

        // Return the attempts as a string
        return resultDetail.attempts.join('');
    };

    // Handle keyboard interaction for direct physical keyboard input
    const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
        if (relaxedIsDisabled) return;

        if (e.key === 'Enter') {
            e.preventDefault(); // Prevent default form submission behavior
            if (inputRef.current) {
                inputRef.current.blur();
            }
            if (onEnterKeyPress) {
                onEnterKeyPress();
            }
            return;
        }

        // Check if we're trying to add a new attempt but are not allowed to
        if (resultDetail?.attempts) {
            if (
                !canAddMoreAttempts(resultDetail.attempts) &&
                ![
                    'Backspace',
                    'Delete',
                    'ArrowLeft',
                    'ArrowRight',
                    'Tab',
                ].includes(e.key)
            ) {
                e.preventDefault();
            }
        }
    };

    // Handle direct keyboard input
    const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
        if (relaxedIsDisabled) return;

        // Only process input if this field is currently focused
        if (
            currentInput?.resultId === resultId &&
            currentInput?.height === height
        ) {
            const newValue = e.target.value;

            // For height events, we accept X, O, -, and R characters
            // Filter out any other characters
            const validInput = newValue
                .split('')
                .filter(
                    (char) =>
                        char === 'X' ||
                        char === 'O' ||
                        char === '-' ||
                        char === 'R'
                )
                .join('');

            // Limit to max 3 attempts
            const limitedInput = validInput.slice(0, 3);

            // Check if we're adding (not just modifying or deleting)
            if (
                resultDetail?.attempts &&
                limitedInput.length > resultDetail.attempts.length &&
                !canAddMoreAttempts(resultDetail.attempts)
            ) {
                return; // Don't allow adding more attempts after O, -, or R
            }

            onInputChange(limitedInput);
        }
    };

    // Handle blur event
    const handleBlur = () => {
        if (relaxedIsDisabled) return;

        if (
            currentInput?.resultId === resultId &&
            currentInput?.height === height &&
            onInputBlur
        ) {
            onInputBlur();
        }
    };

    // Position cursor at the end of input when focused
    const handleClick = () => {
        if (relaxedIsDisabled) return;

        if (inputRef.current) {
            const length = inputRef.current.value.length;
            inputRef.current.setSelectionRange(length, length);
        }
    };

    // Focus the input when it becomes the current input
    useEffect(() => {
        if (
            !relaxedIsDisabled &&
            currentInput?.resultId === resultId &&
            currentInput?.height === height &&
            inputRef.current &&
            document.activeElement !== inputRef.current
        ) {
            inputRef.current.focus();
            handleClick();
        }
    }, [currentInput, resultId, height, relaxedIsDisabled]);

    // Check if this is the current input being edited
    const isCurrentInput =
        currentInput?.resultId === resultId && currentInput?.height === height;

    return (
        <Box>
            <TextField
                id={`height-result-${resultId}-${height}`}
                inputRef={inputRef}
                variant="outlined"
                size="small"
                value={getDisplayValue()}
                onChange={handleChange}
                onFocus={() =>
                    !relaxedIsDisabled && handleInputFocus(resultId, height)
                }
                onBlur={handleBlur}
                onClick={handleClick}
                onKeyDown={handleKeyDown}
                disabled={relaxedIsDisabled}
                // Set readOnly dynamically based on device type
                InputProps={{
                    readOnly: isMobileDevice,
                }}
                inputProps={{
                    style: {
                        textAlign: 'center',
                        fontWeight: 'bold',
                    },
                }}
                sx={{
                    width: '80px',
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
                        ...(relaxedIsDisabled && {
                            backgroundColor: 'rgba(0, 0, 0, 0.12)',
                            color: 'rgba(0, 0, 0, 0.38)',
                            boxShadow: 'none',
                            border: '1px solid rgba(0, 0, 0, 0.23)',
                            pointerEvents: 'none',
                        }),
                        // Success styling for completed attempts
                        ...(resultDetail?.attempts &&
                            resultDetail.attempts.length > 0 && {
                                boxShadow: '0 0 0 1px #4caf50',
                                border: '1px solid #4caf50',
                                background:
                                    'linear-gradient(rgba(76, 175, 80, 0.08), rgba(76, 175, 80, 0.12))',
                            }),
                        // If the last attempt is X (fail), add red styling
                        ...(resultDetail?.attempts &&
                            resultDetail.attempts.length > 0 &&
                            resultDetail.attempts[
                                resultDetail.attempts.length - 1
                            ] === AttemptValue.X && {
                                boxShadow: '0 0 0 1px #f44336',
                                border: '1px solid #f44336',
                                background:
                                    'linear-gradient(rgba(244, 67, 54, 0.08), rgba(244, 67, 54, 0.12))',
                            }),
                        // If the last attempt is PASS, add blue styling
                        ...(resultDetail?.attempts &&
                            resultDetail.attempts.length > 0 &&
                            resultDetail.attempts[
                                resultDetail.attempts.length - 1
                            ] === AttemptValue.PASS && {
                                boxShadow: '0 0 0 1px #2196f3',
                                border: '1px solid #2196f3',
                                background:
                                    'linear-gradient(rgba(25, 118, 210, 0.08), rgba(25, 118, 210, 0.12))',
                            }),
                        // If the last attempt is r, add warning styling
                        ...(resultDetail?.attempts &&
                            resultDetail.attempts.length > 0 &&
                            resultDetail.attempts[
                                resultDetail.attempts.length - 1
                            ] === AttemptValue.R && {
                                boxShadow: '0 0 0 1px #ff9800',
                                border: '1px solid #ff9800',
                                background:
                                    'linear-gradient(rgba(255, 152, 0, 0.08), rgba(255, 152, 0, 0.12))',
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
                        ...(resultDetail?.attempts &&
                        resultDetail.attempts.length > 0
                            ? {
                                  border: 'none',
                              }
                            : {}),
                    },
                    '&:hover .MuiInputBase-root': {
                        // Don't change hover for disabled inputs
                        ...(relaxedIsDisabled
                            ? {}
                            : {
                                  // Hover styles for inputs with results
                                  ...(resultDetail?.attempts &&
                                      resultDetail.attempts.length > 0 && {
                                          background:
                                              'linear-gradient(rgba(76, 175, 80, 0.12), rgba(76, 175, 80, 0.18))',
                                      }),
                                  // Hover styles for failed attempts
                                  ...(resultDetail?.attempts &&
                                      resultDetail.attempts.length > 0 &&
                                      resultDetail.attempts[
                                          resultDetail.attempts.length - 1
                                      ] === AttemptValue.X && {
                                          background:
                                              'linear-gradient(rgba(244, 67, 54, 0.12), rgba(244, 67, 54, 0.18))',
                                      }),
                                  // Hover styles for passed attempts
                                  ...(resultDetail?.attempts &&
                                      resultDetail.attempts.length > 0 &&
                                      resultDetail.attempts[
                                          resultDetail.attempts.length - 1
                                      ] === AttemptValue.PASS && {
                                          background:
                                              'linear-gradient(rgba(25, 118, 210, 0.12), rgba(25, 118, 210, 0.18))',
                                      }),
                                  // Hover styles for r attempts
                                  ...(resultDetail?.attempts &&
                                      resultDetail.attempts.length > 0 &&
                                      resultDetail.attempts[
                                          resultDetail.attempts.length - 1
                                      ] === AttemptValue.R && {
                                          background:
                                              'linear-gradient(rgba(255, 152, 0, 0.12), rgba(255, 152, 0, 0.18))',
                                      }),
                              }),
                    },
                }}
            />
        </Box>
    );
};
