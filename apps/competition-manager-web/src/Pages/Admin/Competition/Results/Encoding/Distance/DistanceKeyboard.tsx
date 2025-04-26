import { ResultDetailCode } from '@competition-manager/schemas';
import {
    faArrowRight,
    faBackspace,
    faFlag,
    faMinus,
    faTimes,
} from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Box, Button, Drawer, Grid } from '@mui/material';
import { useEffect, useRef } from 'react';

interface DistanceKeyboardProps {
    open: boolean;
    inputValue: string;
    onKeyboardInput: (value: string) => void;
    onEnterPressed: () => void;
    onClose: () => void;
}

export const DistanceKeyboard: React.FC<DistanceKeyboardProps> = ({
    open,
    inputValue,
    onKeyboardInput,
    onEnterPressed,
    onClose,
}) => {
    const keyboardContainerRef = useRef<HTMLDivElement>(null);

    // Capture physical keyboard events when the virtual keyboard is open
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            // Only process keyboard events when the keyboard is open
            if (!open) return;

            // Prevent default behavior for these keys to avoid scrolling or other browser actions
            if (
                e.key === 'Enter' ||
                e.key === 'Backspace' ||
                e.key.match(/^[0-9.]$/) ||
                e.key === 'x' ||
                e.key === 'X' ||
                e.key === '-' ||
                e.key === 'r' ||
                e.key === 'R'
            ) {
                e.preventDefault();
            }

            // Map physical keyboard input to virtual keyboard actions
            switch (e.key) {
                case 'Enter':
                    handleKeyPress('ENTER');
                    break;
                case 'Backspace':
                    handleKeyPress('BKSP');
                    break;
                case 'x':
                case 'X':
                    handleKeyPress('X');
                    break;
                case '-':
                    handleKeyPress('-');
                    break;
                case 'r':
                case 'R':
                    handleKeyPress('r');
                    break;
                case '.':
                case ',': // Allow comma as decimal separator too
                    handleKeyPress('.');
                    break;
                default:
                    // Handle numeric keys
                    if (e.key.match(/^[0-9]$/)) {
                        handleKeyPress(e.key);
                    }
                    break;
            }
        };

        if (open) {
            // Add global keyboard event listener
            document.addEventListener('keydown', handleKeyDown);
        }

        return () => {
            document.removeEventListener('keydown', handleKeyDown);
        };
    }, [open, inputValue, onKeyboardInput, onEnterPressed, onClose]);

    // Prevent losing focus when clicking on the keyboard
    useEffect(() => {
        const handleMouseDown = (e: MouseEvent) => {
            if (keyboardContainerRef.current?.contains(e.target as Node)) {
                e.preventDefault();
            }
        };

        document.addEventListener('mousedown', handleMouseDown);

        return () => {
            document.removeEventListener('mousedown', handleMouseDown);
        };
    }, []);

    // Close keyboard when clicking outside
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (
                open &&
                keyboardContainerRef.current &&
                !keyboardContainerRef.current.contains(event.target as Node)
            ) {
                // Call onClose when keyboard is closed
                onClose();
            }
        };

        if (open) {
            document.addEventListener('mousedown', handleClickOutside);
        }

        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [open, onClose]);

    const handleKeyPress = (value: string) => {
        if (value === 'ENTER') {
            // Call the onEnterPressed callback
            onEnterPressed();
        } else if (value === 'BKSP') {
            let correctedValue = inputValue;
            switch (parseFloat(correctedValue)) {
                case ResultDetailCode.X:
                    correctedValue = 'X';
                    break;
                case ResultDetailCode.PASS:
                    correctedValue = '-';
                    break;
                case ResultDetailCode.R:
                    correctedValue = 'r';
                    break;
                default:
                    correctedValue = inputValue;
                    break;
            }

            const newValue = correctedValue.slice(0, -1);
            onKeyboardInput(newValue);
        } else if (value === 'X' || value === '-' || value === 'r') {
            // For special characters, replace the entire input
            onKeyboardInput(value);
        } else {
            // Regular key press - append the character
            const newValue = inputValue + value;
            onKeyboardInput(newValue);
        }
    };

    return (
        <Drawer
            anchor={'bottom'}
            variant="persistent"
            open={open}
            onClose={onClose}
            SlideProps={{
                onMouseDown: (e) => {
                    // Prevent input blur when clicking on the drawer
                    e.stopPropagation();
                },
            }}
        >
            <Box
                ref={keyboardContainerRef}
                sx={{
                    padding: '6px',
                    backgroundColor: '#f8f9fa',
                    borderTop: '1px solid #e0e0e0',
                    boxShadow: '0px -2px 10px rgba(0, 0, 0, 0.1)',
                }}
                onMouseDown={(e) => {
                    e.preventDefault();
                }}
            >
                <Grid container spacing={0.5}>
                    {/* Row 1 */}
                    <Grid item xs={3}>
                        <Button
                            fullWidth
                            variant="contained"
                            color="primary"
                            onClick={() => handleKeyPress('7')}
                            sx={{
                                height: 42,
                                borderRadius: 1,
                                fontSize: '1.2rem',
                            }}
                        >
                            7
                        </Button>
                    </Grid>
                    <Grid item xs={3}>
                        <Button
                            fullWidth
                            variant="contained"
                            color="primary"
                            onClick={() => handleKeyPress('8')}
                            sx={{
                                height: 42,
                                borderRadius: 1,
                                fontSize: '1.2rem',
                            }}
                        >
                            8
                        </Button>
                    </Grid>
                    <Grid item xs={3}>
                        <Button
                            fullWidth
                            variant="contained"
                            color="primary"
                            onClick={() => handleKeyPress('9')}
                            sx={{
                                height: 42,
                                borderRadius: 1,
                                fontSize: '1.2rem',
                            }}
                        >
                            9
                        </Button>
                    </Grid>
                    <Grid item xs={3}>
                        <Button
                            fullWidth
                            variant="contained"
                            color="error"
                            onClick={() => handleKeyPress('BKSP')}
                            sx={{
                                height: 42,
                                borderRadius: 1,
                            }}
                        >
                            <FontAwesomeIcon
                                icon={faBackspace}
                                fontSize="16px"
                            />
                        </Button>
                    </Grid>

                    {/* Row 2 */}
                    <Grid item xs={3}>
                        <Button
                            fullWidth
                            variant="contained"
                            color="primary"
                            onClick={() => handleKeyPress('4')}
                            sx={{
                                height: 42,
                                borderRadius: 1,
                                fontSize: '1.2rem',
                            }}
                        >
                            4
                        </Button>
                    </Grid>
                    <Grid item xs={3}>
                        <Button
                            fullWidth
                            variant="contained"
                            color="primary"
                            onClick={() => handleKeyPress('5')}
                            sx={{
                                height: 42,
                                borderRadius: 1,
                                fontSize: '1.2rem',
                            }}
                        >
                            5
                        </Button>
                    </Grid>
                    <Grid item xs={3}>
                        <Button
                            fullWidth
                            variant="contained"
                            color="primary"
                            onClick={() => handleKeyPress('6')}
                            sx={{
                                height: 42,
                                borderRadius: 1,
                                fontSize: '1.2rem',
                            }}
                        >
                            6
                        </Button>
                    </Grid>
                    <Grid item xs={3}>
                        <Button
                            fullWidth
                            variant="contained"
                            color="error"
                            onClick={() => handleKeyPress('X')}
                            sx={{
                                height: 42,
                                borderRadius: 1,
                            }}
                        >
                            <FontAwesomeIcon icon={faTimes} fontSize="16px" />
                        </Button>
                    </Grid>

                    {/* Row 3 */}
                    <Grid item xs={3}>
                        <Button
                            fullWidth
                            variant="contained"
                            color="primary"
                            onClick={() => handleKeyPress('1')}
                            sx={{
                                height: 42,
                                borderRadius: 1,
                                fontSize: '1.2rem',
                            }}
                        >
                            1
                        </Button>
                    </Grid>
                    <Grid item xs={3}>
                        <Button
                            fullWidth
                            variant="contained"
                            color="primary"
                            onClick={() => handleKeyPress('2')}
                            sx={{
                                height: 42,
                                borderRadius: 1,
                                fontSize: '1.2rem',
                            }}
                        >
                            2
                        </Button>
                    </Grid>
                    <Grid item xs={3}>
                        <Button
                            fullWidth
                            variant="contained"
                            color="primary"
                            onClick={() => handleKeyPress('3')}
                            sx={{
                                height: 42,
                                borderRadius: 1,
                                fontSize: '1.2rem',
                            }}
                        >
                            3
                        </Button>
                    </Grid>
                    <Grid item xs={3}>
                        <Button
                            fullWidth
                            variant="contained"
                            color="info"
                            onClick={() => handleKeyPress('-')}
                            sx={{
                                height: 42,
                                borderRadius: 1,
                            }}
                        >
                            <FontAwesomeIcon icon={faMinus} fontSize="16px" />
                        </Button>
                    </Grid>

                    {/* Row 4 */}
                    <Grid item xs={3}>
                        <Button
                            fullWidth
                            variant="contained"
                            color="primary"
                            onClick={() => handleKeyPress('0')}
                            sx={{
                                height: 42,
                                borderRadius: 1,
                                fontSize: '1.2rem',
                            }}
                        >
                            0
                        </Button>
                    </Grid>
                    <Grid item xs={3}>
                        <Button
                            fullWidth
                            variant="contained"
                            color="primary"
                            onClick={() => handleKeyPress('.')}
                            sx={{
                                height: 42,
                                borderRadius: 1,
                                fontSize: '1.2rem',
                            }}
                        >
                            .
                        </Button>
                    </Grid>
                    <Grid item xs={3}>
                        <Button
                            fullWidth
                            variant="contained"
                            color="warning"
                            onClick={() => handleKeyPress('r')}
                            sx={{
                                height: 42,
                                borderRadius: 1,
                            }}
                        >
                            <FontAwesomeIcon icon={faFlag} fontSize="16px" />
                        </Button>
                    </Grid>
                    <Grid item xs={3}>
                        <Button
                            fullWidth
                            variant="contained"
                            color="success"
                            onClick={() => handleKeyPress('ENTER')}
                            sx={{
                                height: 42,
                                borderRadius: 1,
                            }}
                        >
                            <FontAwesomeIcon
                                icon={faArrowRight}
                                fontSize="16px"
                            />
                        </Button>
                    </Grid>
                </Grid>
            </Box>
        </Drawer>
    );
};
