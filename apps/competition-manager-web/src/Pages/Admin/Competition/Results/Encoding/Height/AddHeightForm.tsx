import { useDeviceSize } from '@/hooks';
import { faCheck, faMinus, faPlus } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Box, Button, Chip, InputBase, Paper } from '@mui/material';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';

interface AddHeightFormProps {
    onAddHeight: (height: number) => void;
    existingHeights: number[];
}

export const AddHeightForm: React.FC<AddHeightFormProps> = ({
    onAddHeight,
    existingHeights,
}) => {
    const { t } = useTranslation();
    const { isTablet } = useDeviceSize();
    const [heightValue, setHeightValue] = useState<number>(0);
    const [inputValue, setInputValue] = useState<string>('0.00');
    const [error, setError] = useState<string | null>(null);
    const [heightExists, setHeightExists] = useState(false);

    // Common increments for quick addition
    const commonIncrements = [0.03, 0.05, 0.1];

    // Initialize with the maximum current height
    useEffect(() => {
        if (existingHeights.length > 0) {
            const maxHeight = Math.max(...existingHeights);
            setHeightValue(maxHeight);
            setInputValue(maxHeight.toFixed(2));
        } else {
            setHeightValue(1.0); // Default starting height if no heights exist
            setInputValue('1.00');
        }
    }, [existingHeights]);

    // Check if height exists whenever heightValue changes
    useEffect(() => {
        setHeightExists(existingHeights.includes(heightValue));
    }, [heightValue, existingHeights]);

    // Validate the height value
    const validateHeight = (value: number): boolean => {
        if (value <= 0) {
            setError(t('result:heightMustBePositive'));
            return false;
        }

        if (existingHeights.includes(value)) {
            setError(t('result:heightAlreadyExists'));
            return false;
        }

        setError(null);
        return true;
    };

    // Handle height submission
    const handleAddHeight = () => {
        if (!validateHeight(heightValue)) {
            // Show error feedback
            return;
        }

        onAddHeight(heightValue);

        // Move to next suggested height
        const newValue = parseFloat((heightValue + 0.05).toFixed(2));
        setHeightValue(newValue);
        setInputValue(newValue.toFixed(2));
    };

    // Handle increment/decrement
    const adjustHeight = (amount: number) => {
        const newValue = parseFloat((heightValue + amount).toFixed(2));
        setHeightValue(newValue);
        setInputValue(newValue.toFixed(2));
        validateHeight(newValue);
    };

    // Handle direct input changes
    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        setInputValue(value);

        const numericValue = parseFloat(value);
        if (!isNaN(numericValue)) {
            setHeightValue(numericValue);
            validateHeight(numericValue);
        }
    };

    // Handle blur event to format the input
    const handleInputBlur = () => {
        // Format to 2 decimal places when leaving the field
        setInputValue(heightValue.toFixed(2));
    };

    // Handle keyboard enter key
    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter') {
            handleAddHeight();
        }
    };

    return (
        <Box
            sx={{
                display: 'flex',
                justifyContent: isTablet ? 'center' : 'flex-end',
                width: '100%',
                mb: 2,
            }}
        >
            <Paper
                elevation={2}
                sx={{
                    display: 'flex',
                    flexDirection: isTablet ? 'column' : 'row',
                    alignItems: 'center',
                    gap: 1.5,
                    p: 1.5,
                    borderRadius: '10px',
                    border: '1px solid rgba(0, 0, 0, 0.08)',
                    width: isTablet ? '100%' : 'auto',
                    maxWidth: '100%',
                }}
            >
                <Paper
                    elevation={0}
                    sx={{
                        display: 'flex',
                        alignItems: 'center',
                        borderRadius: '20px',
                        overflow: 'hidden',
                        border: '1px solid rgba(0, 0, 0, 0.08)',
                        height: '40px',
                        width: isTablet ? '100%' : 'auto',
                    }}
                >
                    <Button
                        onClick={() => adjustHeight(-0.01)}
                        sx={{
                            minWidth: '40px',
                            minHeight: '40px',
                            borderRadius: 0,
                            flex: isTablet ? 1 : 'none',
                        }}
                    >
                        <FontAwesomeIcon icon={faMinus} />
                    </Button>

                    <InputBase
                        value={inputValue}
                        onChange={handleInputChange}
                        onBlur={handleInputBlur}
                        onKeyDown={handleKeyDown}
                        inputProps={{
                            style: {
                                textAlign: 'center',
                                fontWeight: 'bold',
                                color: heightExists ? 'error' : 'primary',
                                padding: '0 8px',
                            },
                        }}
                        endAdornment="m"
                        sx={{
                            width: '80px',
                            padding: '0 8px',
                        }}
                    />

                    <Button
                        onClick={() => adjustHeight(0.01)}
                        sx={{
                            minWidth: '40px',
                            minHeight: '40px',
                            borderRadius: 0,
                            flex: isTablet ? 1 : 'none',
                        }}
                    >
                        <FontAwesomeIcon icon={faPlus} />
                    </Button>
                </Paper>

                {/* Quick-add chips */}
                <Box
                    sx={{
                        display: 'flex',
                        flexWrap: 'wrap',
                        gap: 1,
                        justifyContent: 'center',
                        width: isTablet ? '100%' : 'auto',
                    }}
                >
                    {commonIncrements.map((increment) => (
                        <Chip
                            key={increment}
                            label={`+${increment}m`}
                            clickable
                            color="primary"
                            variant="outlined"
                            size="small"
                            onClick={() => adjustHeight(increment)}
                            sx={{
                                height: '32px',
                                flex: isTablet ? '1 1 calc(33% - 8px)' : 'none',
                            }}
                        />
                    ))}
                </Box>

                <Button
                    variant="contained"
                    color="primary"
                    onClick={handleAddHeight}
                    disabled={!!error || heightExists}
                    size="small"
                    sx={{
                        height: '40px',
                        minWidth: isTablet ? '100%' : '40px',
                        width: isTablet ? '100%' : '40px',
                    }}
                >
                    <FontAwesomeIcon icon={faCheck} />
                </Button>
            </Paper>
        </Box>
    );
};
