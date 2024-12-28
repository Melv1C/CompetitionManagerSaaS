import { FormControl, FormLabel, TextField, TextFieldProps } from '@mui/material';
import { useState } from 'react';
import { ZodSchema } from 'zod';

export type FieldValueProps<T = any> = {
    value: T;
    onChange: (value: T) => void;
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

export type BaseFieldWith$Props = Omit<TextFieldProps, 'label' | 'value'> & {
    id: string;
    label: LabelProps;
    value: FieldValueProps;
    validator: Validator;
};

export const BaseFieldWith$: React.FC<BaseFieldWith$Props> = ({ 
    id,
    label,
    value,
    validator,
    ...props
}) => {
    const [hasBlurred, setHasBlurred] = useState(false);
    const [errorMsg, setErrorMsg] = useState('');

    return (
        <FormControl>
            {label.hasExtrenLabel && <FormLabel htmlFor={id}>{label.value}</FormLabel>}
            <TextField
                label={!label.hasExtrenLabel ? label.value : ''}
                value={value.value}
                onChange={(e) => value.onChange(e.target.value)}
                id={id}
                variant="outlined"
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