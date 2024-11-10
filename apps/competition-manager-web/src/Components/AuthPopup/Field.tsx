import { useState } from 'react';
import { ZodSchema } from 'zod';

import { FormControl, FormLabel, IconButton, InputAdornment, TextField } from '@mui/material';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEye, faEyeSlash } from '@fortawesome/free-solid-svg-icons';

export type FieldValueProps = {
    value: string;
    onChange: (value: string) => void;
};

export type Validator = {
    Schema$: ZodSchema;
    isValid: boolean;
    setIsValid: (value: boolean) => void;
};

type FieldProps = {
    id: string;
    label: string;
    value: FieldValueProps;
    isPassword?: boolean;
    validator?: Validator;
};

export const Field: React.FC<FieldProps> = ({ 
    id,
    label,
    value,
    isPassword = false,
    validator
}) => {
    const [IsPasswordVisible, setIsPasswordVisible] = useState(false);
    const [errorMsg, setErrorMsg] = useState('');

    const handleClickShow = () => {
        setIsPasswordVisible((prev) => !prev);
    };

    const handleMouseDown = (event: React.MouseEvent<HTMLButtonElement>) => {
        event.preventDefault();
    };

    return (
        <FormControl>
            <FormLabel htmlFor={id}>{label}</FormLabel>
            <TextField
                value={value.value}
                onChange={(e) => value.onChange(e.target.value)}
                id={id}
                type={isPassword ? (IsPasswordVisible ? 'text' : 'password') : 'text'}
                variant="outlined"
                required
                slotProps={isPassword ? {
                    input: {
                        endAdornment: (
                            <InputAdornment position="end">
                                <IconButton
                                    aria-label="toggle password visibility"
                                    onClick={handleClickShow}
                                    onMouseDown={handleMouseDown}
                                >
                                    <FontAwesomeIcon icon={IsPasswordVisible ? faEye : faEyeSlash} size='xs' />
                                </IconButton>
                            </InputAdornment>
                        ),
                    },
                } : {}}
                error={!validator?.isValid}
                helperText={!validator?.isValid ? errorMsg : ''}
                onBlur={(e) => {
                    if (!validator || !validator.Schema$ || !e.target.value) {
                        validator?.setIsValid(true);
                        setErrorMsg('');
                        return;
                    }
                    const { success, error} = validator.Schema$.safeParse(e.target.value);
                    validator.setIsValid(success);
                    setErrorMsg(error?.errors?.map(e => e.message).join(', ') ?? '');
                }}
            />
        </FormControl>
    );
};