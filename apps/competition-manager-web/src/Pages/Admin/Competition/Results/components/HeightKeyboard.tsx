import { Box, Drawer } from "@mui/material";
import Keyboard from 'react-simple-keyboard';
import "react-simple-keyboard/build/css/index.css";
import { useRef, useState, useEffect } from "react";

type HeightKeyboardProps = {
    open: boolean;
    setOpen: React.Dispatch<React.SetStateAction<boolean>>;
    inputValue: string;
    onKeyboardInput: (value: string) => void;
};

export const HeightKeyboard = ({ open, setOpen, inputValue, onKeyboardInput }: HeightKeyboardProps) => {
    const keyboardContainerRef = useRef<HTMLDivElement>(null);
    const keyboardRef = useRef<any>(null);
    const [layoutName, setLayoutName] = useState("default");
    const [internalInputValue, setInternalInputValue] = useState("");
    const [lastFocusedElement, setLastFocusedElement] = useState<HTMLElement | null>(null);

    // Track the last focused input element
    useEffect(() => {
        if (open) {
            // Store the currently focused element when the keyboard opens
            setLastFocusedElement(document.activeElement as HTMLElement);
            
            // Add focus/blur event listeners to track focused elements
            const handleFocus = (e: FocusEvent) => {
                const target = e.target as HTMLElement;
                if (target.tagName === 'INPUT') {
                    setLastFocusedElement(target);
                }
            };
            
            document.addEventListener('focus', handleFocus, true);
            
            return () => {
                document.removeEventListener('focus', handleFocus, true);
            };
        }
    }, [open]);
    
    // Prevent losing focus when clicking on the keyboard
    useEffect(() => {
        const handleMouseDown = (e: MouseEvent) => {
            // Prevent the default behavior which would cause the input to lose focus
            if (keyboardContainerRef.current?.contains(e.target as Node)) {
                e.preventDefault();
            }
        };
        
        document.addEventListener('mousedown', handleMouseDown);
        
        return () => {
            document.removeEventListener('mousedown', handleMouseDown);
        };
    }, []);

    // Close keyboard when clicking outside (but not when clicking the keyboard itself)
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (open && 
                keyboardContainerRef.current && 
                !keyboardContainerRef.current.contains(event.target as Node)) {
                setOpen(false);
            }
        };

        if (open) {
            document.addEventListener("mousedown", handleClickOutside);
        }

        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, [open, setOpen]);

    // Update internal state when input value changes externally
    useEffect(() => {
        setInternalInputValue(inputValue || "");
        if (keyboardRef.current) {
            keyboardRef.current.setInput(inputValue || "");
        }
    }, [inputValue]);

    const handleKeyPress = (button: string) => {
        // Ensure the last focused element stays focused
        if (lastFocusedElement && document.activeElement !== lastFocusedElement) {
            lastFocusedElement.focus();
        }

        if (button === "{code}") {
            setLayoutName("code");
        } else if (button === "{DNF}" || button === "{DNS}" || button === "{DQ}") {
            const value = button.replace(/[{}]/g, '');
            setInternalInputValue(value);
            onKeyboardInput(value);
            setLayoutName("default");
        } else if (button === "{bksp}") {
            // Handle backspace - remove the last character
            const newValue = internalInputValue.slice(0, -1);
            setInternalInputValue(newValue);
            onKeyboardInput(newValue);
        } else if (button === "{back}") {
            // Return to default layout
            setLayoutName("default");
        } else {
            // Regular key press - for numeric keyboard, just send the digit
            const newValue = button === "O" || button === "X" || button === "-" ? button : internalInputValue + button;
            setInternalInputValue(newValue);
            onKeyboardInput(newValue);
        }
    };

    const handleChange = (input: string) => {
        setInternalInputValue(input);
        onKeyboardInput(input);
    };

    return (
        <Drawer
            anchor={'bottom'}
            variant="persistent"
            open={open}
            onClose={() => setOpen(false)}
            SlideProps={{
                onMouseDown: (e) => {
                    // Prevent input blur when clicking on the drawer
                    e.stopPropagation();
                }
            }}
        >
            <Box 
                ref={keyboardContainerRef}
                sx={{
                    color: "black",
                    padding: "0 10%",
                    backgroundColor: "#ececec",
                }}
                // Prevent blur events
                onMouseDown={(e) => {
                    e.preventDefault();
                }}
            >
                <Keyboard
                    keyboardRef={(r) => (keyboardRef.current = r)}
                    layoutName={layoutName}
                    onKeyPress={handleKeyPress}
                    onChange={handleChange}
                    inputName="numericInput"
                    input={internalInputValue}
                    layout={{
                        default: [
                            "X O -",
                            "{code} {bksp}"
                        ],
                        code: [
                            "{DNF} {DNS} {DQ}",
                            "{back} {bksp}",
                        ]
                    }}
                    display={{
                        '{code}': 'Code',
                        '{bksp}': '⌫',
                        '{back}': '← Back',
                        '{DNF}': 'DNF',
                        '{DNS}': 'DNS',
                        '{DQ}': 'DQ',
                    }}
                    width={"100%"}
                    physicalKeyboardHighlight={true}
                    preventMouseDownDefault={true}
                />
            </Box>
        </Drawer>
    )
};

