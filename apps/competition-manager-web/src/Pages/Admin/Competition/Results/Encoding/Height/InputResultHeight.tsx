import { AttemptValue, Id, ResultDetail } from '@competition-manager/schemas';
import { Box, TextField } from '@mui/material';
import { useEffect, useRef } from 'react';

interface InputResultHeightProps {
    resultId: Id;
    height: number;
    resultDetail: ResultDetail | undefined;
    handleInputFocus: (resultId: Id, height: number) => void;
    currentInput: {
        resultId: Id;
        height: number;
    };
    isDisabled?: boolean;
}

export const InputResultHeight: React.FC<InputResultHeightProps> = ({
    resultId,
    height,
    resultDetail,
    handleInputFocus,
    currentInput,
    isDisabled = false,
}) => {
    const inputRef = useRef<HTMLInputElement>(null);
    const containerRef = useRef<HTMLDivElement>(null);

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

    // Focus the input when it becomes the current input
    useEffect(() => {
        if (
            !relaxedIsDisabled &&
            currentInput?.resultId === resultId &&
            currentInput?.height === height
        ) {
            // Focus the input and scroll into view
            if (
                inputRef.current &&
                document.activeElement !== inputRef.current
            ) {
                inputRef.current.focus();

                // Scroll element into view
                if (containerRef.current) {
                    containerRef.current.scrollIntoView({
                        behavior: 'smooth',
                        block: 'center',
                    });
                }
            }
        } else if (
            // If this is no longer the current input but is focused, blur it
            inputRef.current &&
            document.activeElement === inputRef.current &&
            (currentInput?.resultId !== resultId ||
                currentInput?.height !== height)
        ) {
            inputRef.current.blur();
        }
    }, [currentInput, resultId, height, relaxedIsDisabled]);

    // Check if this is the current input being edited
    const isCurrentInput =
        currentInput?.resultId === resultId && currentInput?.height === height;

    return (
        <Box ref={containerRef}>
            <TextField
                id={`height-result-${resultId}-${height}`}
                inputRef={inputRef}
                variant="outlined"
                size="small"
                value={getDisplayValue()}
                onFocus={() =>
                    !relaxedIsDisabled && handleInputFocus(resultId, height)
                }
                disabled={relaxedIsDisabled}
                // Set readOnly to always be true to prevent mobile keyboard
                InputProps={{
                    readOnly: true,
                }}
                inputProps={{
                    style: {
                        textAlign: 'center',
                        fontWeight: 'bold',
                        position: 'relative',
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
                        // Enhanced current input styling
                        ...(isCurrentInput && {
                            transform: 'scale(1.05)',
                            boxShadow: '0 0 12px 4px rgba(25, 118, 210, 0.6)',
                            border: '2px solid #1976d2',
                            animation: 'pulse 1.5s infinite ease-in-out',
                            zIndex: 10,
                            position: 'relative',
                            background: 'rgba(25, 118, 210, 0.04)', // Light blue background tint
                        }),
                    },
                    '@keyframes pulse': {
                        '0%': {
                            boxShadow: '0 0 0 0 rgba(25, 118, 210, 0.6)',
                        },
                        '70%': {
                            boxShadow: '0 0 0 10px rgba(25, 118, 210, 0)',
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
