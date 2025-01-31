import React, { useMemo, useRef } from "react";
import { Box, TextField } from "@mui/material";

const digitsToMilliseconds = (digits: number[]) => {
    const minutes = digits[0] * 10 + digits[1];
    const seconds = digits[2] * 10 + digits[3];
    const centiseconds = digits[4] * 10 + digits[5];
    return (minutes * 60 + seconds) * 1000 + centiseconds * 10;
};

const millisecondsToDigits = (milliseconds: number) => {
    const centiseconds = Math.floor(milliseconds / 10) % 100;
    const seconds = Math.floor(milliseconds / 1000) % 60;
    const minutes = Math.floor(milliseconds / 60000);
    return [Math.floor(minutes / 10), minutes % 10, Math.floor(seconds / 10), seconds % 10, Math.floor(centiseconds / 10), centiseconds % 10];
};

const digitsToMeters = (digits: number[]) => {
    const meters = digits[0] * 10 + digits[1];
    const centimeters = digits[2] * 10 + digits[3];
    return meters + centimeters / 100;
};

const metersToDigits = (meters: number) => {
    const centimeters = Math.round((meters % 1) * 100);
    const metersInt = Math.floor(meters);
    return [Math.floor(metersInt / 10), metersInt % 10, Math.floor(centimeters / 10), centimeters % 10];
};

const digitsToPoints = (digits: number[]) => {
    return digits[0] * 1000 + digits[1] * 100 + digits[2] * 10 + digits[3];
};

const pointsToDigits = (points: number) => {
    return [Math.floor(points / 1000), Math.floor(points / 100) % 10, Math.floor(points / 10) % 10, points % 10];
};

const handleFocus = (e: React.FocusEvent<HTMLInputElement>) => {
    setTimeout(() => {
        e.target.select(); // Ensure full selection after focus
    }, 0); // Slight delay ensures no conflict with navigation
};

const handleMouseDown = (e: React.MouseEvent<HTMLInputElement>) => {
    e.preventDefault(); // Prevent default cursor placement behavior
    const target = e.target as HTMLInputElement;
    target.focus();
    target.select(); // Ensure the content is fully selected
};

const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLDivElement>, refs: React.MutableRefObject<HTMLInputElement[]>) => {
    const value = (e.currentTarget.children?.item(0)?.children?.item(0) as HTMLInputElement)?.value
    if (e.key === value && refs.current[index + 1]) {
        refs.current[index + 1].focus();
    } else if  (e.key === value && !refs.current[index + 1]) {
        refs.current[index].blur();
    } else if (e.key === "ArrowLeft" && index === 0) {
        refs.current[index].blur();
    } else if (e.key === "ArrowRight" && index === refs.current.length - 1) {
        refs.current[index].blur();
    } else if (e.key === "ArrowLeft" && refs.current[index - 1]) {
        refs.current[index - 1].focus();
    } else if (e.key === "ArrowRight" && refs.current[index + 1]) {
        refs.current[index + 1].focus();
    }
};

type InputProps = {
    value: number,
    onChange: (value: number) => void
}

export const TimeInput: React.FC<InputProps> = ({ value, onChange }) => {
    const digits = useMemo(() => millisecondsToDigits(value), [value]);
    const setDigits = (newDigits: number[]) => onChange(digitsToMilliseconds(newDigits));

    const refs = useRef<HTMLInputElement[]>([]);

    const handleTimeChange = (index: number, value: string) => {
        const parsedValue = Number(value);
        if (!/^[0-9]$/.test(parsedValue.toString())) {
            refs.current[index].blur();
            refs.current[index].focus();
            return;
        }

        const newDigits = [...digits];
        const oldValue = newDigits[index];
        newDigits[index] = parsedValue;
        setDigits(newDigits);

        if (value && refs.current[index + 1]) {
            refs.current[index + 1].focus();
        } else if (value && !refs.current[index + 1]) {
            refs.current[index].blur();
        } else if (!value && oldValue === 0 && index > 0) {
            refs.current[index - 1].focus();
        } else {
            refs.current[index].blur();
            refs.current[index].focus();
        }
    };

    return (
        <Box display="flex" alignItems="center">
            {digits.map((digit, index) => (
                <React.Fragment key={index}>
                    <TextField
                        inputRef={(el) => refs.current[index] = el!}
                        value={digit}
                        onFocus={handleFocus}
                        onMouseDown={handleMouseDown}
                        onChange={(e) => handleTimeChange(index, e.target.value)}
                        onKeyDown={(e) => handleKeyDown(index, e, refs)}
                        slotProps={{
                            htmlInput: {
                                maxLength: 1,
                                style: { textAlign: "center", width: "30px", padding: "0.5rem 0", fontSize: "1.5rem" }
                            }
                        }}
                        sx={{ mx: 0.3 }}
                    />
                    {index === 1 && <Box sx={{ mx: 0.5, fontSize: "1.5rem" }}>'</Box>}
                    {index === 3 && <Box sx={{ mx: 0.5, fontSize: "1.5rem" }}>"</Box>}
                </React.Fragment>
            ))}
        </Box>
    );

}

export const DistanceInput: React.FC<InputProps> = ({ value, onChange }) => {
    const digits = useMemo(() => metersToDigits(value), [value]);
    const setDigits = (newDigits: number[]) => onChange(digitsToMeters(newDigits));

    const refs = useRef<HTMLInputElement[]>([]);

    const handleDistanceChange = (index: number, value: string) => {
        const parsedValue = Number(value);
        if (!/^[0-9]$/.test(parsedValue.toString())) {
            refs.current[index].blur();
            refs.current[index].focus();
            return;
        }

        const newDigits = [...digits];
        const oldValue = newDigits[index];
        newDigits[index] = parsedValue;
        setDigits(newDigits);

        if (value && refs.current[index + 1]) {
            refs.current[index + 1].focus();
        } else if (value && !refs.current[index + 1]) {
            refs.current[index].blur();
        } else if (!value && oldValue === 0 && index > 0) {
            refs.current[index - 1].focus();
        } else {
            refs.current[index].blur();
            refs.current[index].focus();
        }
    };

    return (
        <Box display="flex" alignItems="center">
            {digits.map((digit, index) => (
                <React.Fragment key={index}>
                    <TextField
                        inputRef={(el) => refs.current[index] = el!}
                        value={digit}
                        onFocus={handleFocus}
                        onMouseDown={handleMouseDown}
                        onChange={(e) => handleDistanceChange(index, e.target.value)}
                        onKeyDown={(e) => handleKeyDown(index, e, refs)}
                        slotProps={{
                            htmlInput: {
                                maxLength: 1,
                                style: { textAlign: "center", width: "30px", padding: "0.5rem 0", fontSize: "1.5rem" }
                            }
                        }}
                        sx={{ mx: 0.3 }}
                    />
                    {index === 1 && <Box sx={{ mx: 0.5, fontSize: "1.5rem" }}>m</Box>}
                </React.Fragment>
            ))}
        </Box>
    );
}

export const PointsInput: React.FC<InputProps> = ({ value, onChange }) => {
    const digits = useMemo(() => pointsToDigits(value), [value]);
    const setDigits = (newDigits: number[]) => onChange(digitsToPoints(newDigits));

    const refs = useRef<HTMLInputElement[]>([]);

    const handlePointsChange = (index: number, value: string) => {
        const parsedValue = Number(value);
        if (!/^[0-9]$/.test(parsedValue.toString())) {
            refs.current[index].blur();
            refs.current[index].focus();
            return;
        }

        const newDigits = [...digits];
        const oldValue = newDigits[index];
        newDigits[index] = parsedValue;
        setDigits(newDigits);

        if (value && refs.current[index + 1]) {
            refs.current[index + 1].focus();
        } else if (value && !refs.current[index + 1]) {
            refs.current[index].blur();
        } else if (!value && oldValue === 0 && index > 0) {
            refs.current[index - 1].focus();
        } else {
            refs.current[index].blur();
            refs.current[index].focus();
        }
    };

    return (
        <Box display="flex" alignItems="center">
            {digits.map((digit, index) => (
                <TextField
                    key={index}
                    inputRef={(el) => refs.current[index] = el!}
                    value={digit}
                    onFocus={handleFocus}
                    onMouseDown={handleMouseDown}
                    onChange={(e) => handlePointsChange(index, e.target.value)}
                    onKeyDown={(e) => handleKeyDown(index, e, refs)}
                    inputProps={{
                        maxLength: 1,
                        style: { textAlign: "center", width: "30px", padding: "0.5rem 0", fontSize: "1.5rem" }
                    }}
                    sx={{ mx: 0.3 }}
                />
            ))}
            <Box sx={{ mx: 0.5, fontSize: "1.5rem" }}>pts</Box>
        </Box>
    );
}





