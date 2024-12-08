import { faEye, faEyeSlash } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { FormControl, FormLabel, IconButton, InputAdornment, TextField, TextFieldProps } from '@mui/material';
import { useState } from 'react';
import { ZodSchema } from 'zod';

export type FieldValueProps = {
    value: string;
    onChange: (value: string) => void;
};

export type Validator = {
    Schema$: ZodSchema;
    isValid: boolean;
    setIsValid: (value: boolean) => void;
};

export type LabelProps = {
    value: string;
    hasExtrenLabel?: boolean;
};

type TextFieldWithSchemaProps = Omit<TextFieldProps, 'label' | 'value'> & {
    id: string;
    label: LabelProps;
    value: FieldValueProps;
    validator: Validator;
    isPassword?: boolean;
};

export const TextFieldWithSchema: React.FC<TextFieldWithSchemaProps> = ({ 
    id,
    label,
    value,
    validator,
    isPassword = false,
    ...props
}) => {
    const [hasBlurred, setHasBlurred] = useState(false);
    const [errorMsg, setErrorMsg] = useState('');

    const [IsPasswordVisible, setIsPasswordVisible] = useState(false);

    const handleClickShow = () => {
        setIsPasswordVisible((prev) => !prev);
    };

    const handleMouseDown = (event: React.MouseEvent<HTMLButtonElement>) => {
        event.preventDefault();
    };

    return (
        <FormControl>
            {label.hasExtrenLabel && <FormLabel htmlFor={id}>{label.value}</FormLabel>}
            <TextField
                label={!label.hasExtrenLabel ? label.value : ''}
                value={value.value}
                onChange={(e) => value.onChange(e.target.value)}
                id={id}
                type={isPassword ? 'password' : 'text'}
                variant="outlined"
                slotProps={isPassword ? {
                    input: {
                        endAdornment: (
                            <InputAdornment position="end">
                                <IconButton
                                    aria-label="toggle password visibility"
                                    onClick={handleClickShow}
                                    onMouseDown={handleMouseDown}
                                    sx={{ color: 'text.secondary' }}
                                >
                                    <FontAwesomeIcon icon={IsPasswordVisible ? faEye : faEyeSlash} size='xs' />
                                </IconButton>
                            </InputAdornment>
                        ),
                    },
                } : {}}
                error={!validator.isValid && hasBlurred}
                helperText={errorMsg}
                onBlur={(e) => {
                    if (!hasBlurred) {
                        setHasBlurred(true);
                    }
                    const { success, error} = validator.Schema$.safeParse(e.target.value);
                    validator.setIsValid(success);
                    setErrorMsg(error?.errors?.map(e => e.message).join(', ') ?? '');
                }}
                {...props}
            />
        </FormControl>
    );
};