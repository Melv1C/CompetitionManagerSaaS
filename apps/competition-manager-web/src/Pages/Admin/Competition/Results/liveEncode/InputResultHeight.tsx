import { AttemptValue, Id, ResultDetail } from '@competition-manager/schemas';
import { Box, Typography } from '@mui/material';
import { useEffect } from 'react';

type InputResultHeightProps = {
    resultId: Id;
    height: number;
    resultDetail: ResultDetail | undefined;
    handleInputFocus: (resultId: Id, height: number) => void;
    currentInput: {
        resultId: Id;
        height: number;
        value: string;
    };
    isDisabled?: boolean;
    onKeyboardInput?: (value: string) => void;
    findNextInput?: (
        resultId: Id,
        height: number
    ) => { resultId: Id; height: number } | null;
};

export const InputResultHeight = ({
    resultId,
    height,
    resultDetail,
    handleInputFocus,
    currentInput,
    isDisabled = false,
    onKeyboardInput,
    findNextInput,
}: InputResultHeightProps) => {
    // Create attempt symbols display
    const attempts = resultDetail?.attempts || [];

    // Set up keyboard event listeners when this input is focused
    useEffect(() => {
        // Only add keyboard listeners when this input is focused
        if (
            currentInput?.resultId === resultId &&
            currentInput?.height === height &&
            !isDisabled
        ) {
            const handleKeyDown = (event: KeyboardEvent) => {
                // Handle X, O, - keys
                if (event.key === 'x' || event.key === 'X') {
                    onKeyboardInput?.(currentInput.value + AttemptValue.X);
                } else if (event.key === 'o' || event.key === 'O') {
                    onKeyboardInput?.(currentInput.value + AttemptValue.O);
                } else if (event.key === '-') {
                    onKeyboardInput?.(currentInput.value + AttemptValue.PASS);
                } else if (event.key === 'Enter' || event.key === 'Tab') {
                    // Navigate to next input on Enter or Tab
                    if (findNextInput) {
                        const nextInput = findNextInput(resultId, height);
                        if (nextInput) {
                            // Prevent default Tab behavior
                            event.preventDefault();
                            // Focus the next input
                            handleInputFocus(
                                nextInput.resultId,
                                nextInput.height
                            );
                        }
                    }
                } else if (event.key === 'Backspace') {
                    // Handle Backspace to remove the last character
                    if (currentInput.value.length > 0) {
                        onKeyboardInput?.(
                            currentInput.value.slice(0, -1)
                        );
                    }
                }
            };

            // Add the event listener
            document.addEventListener('keydown', handleKeyDown);

            // Clean up the event listener
            return () => {
                document.removeEventListener('keydown', handleKeyDown);
            };
        }
    }, [
        currentInput,
        resultId,
        height,
        onKeyboardInput,
        handleInputFocus,
        findNextInput,
        isDisabled,
    ]);

    // Display a clickable box showing the attempts for this height
    return (
        <Box
            onClick={() => !isDisabled && handleInputFocus(resultId, height)}
            sx={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                gap: 0.5,
                cursor: isDisabled ? 'not-allowed' : 'pointer',
                padding: 1,
                borderRadius: 1,
                minWidth: '70px',
                border: '1px solid #e0e0e0',
                backgroundColor: isDisabled
                    ? '#f0f0f0'
                    : currentInput?.resultId === resultId &&
                      currentInput?.height === height
                    ? 'rgb(156, 209, 255)'
                    : 'inherit',
                height: '16px',
                opacity: isDisabled ? 0.6 : 1,
            }}
        >
            {attempts.length > 0 ? (
                attempts.map((attempt, index) => (
                    <Typography
                        key={index}
                        variant="body1"
                        sx={{
                            fontWeight: 'bold',
                            color:
                                attempt === AttemptValue.O
                                    ? 'green'
                                    : attempt === AttemptValue.X
                                    ? 'red'
                                    : 'grey',
                        }}
                    >
                        {attempt}
                    </Typography>
                ))
            ) : (
                <Typography variant="body2" color="text.secondary">
                    {isDisabled ? '—' : ''}
                </Typography>
            )}
        </Box>
    );
};
