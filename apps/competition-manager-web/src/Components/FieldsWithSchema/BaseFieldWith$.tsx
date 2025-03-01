import {
    FormControl,
    FormControlProps,
    FormLabel,
    FormLabelProps,
    TextField,
    TextFieldProps,
} from '@mui/material';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { ZodSchema } from 'zod';

type FieldValueProps = {
    value: string;
    onChange: (value: string) => void;
};

type Validator = {
    Schema$: ZodSchema;
    isValid: boolean;
    setIsValid: (value: boolean) => void;
};

type LabelProps = {
    value: string;
    hasExtrenLabel?: boolean;
};

export type BaseFieldWith$Props = Omit<TextFieldProps, 'label' | 'value'> & {
    id: string;
    label: LabelProps;
    value: FieldValueProps;
    validator: Validator;
    formControlProps?: FormControlProps;
    formLabelProps?: FormLabelProps;
};

export const BaseFieldWith$: React.FC<BaseFieldWith$Props> = ({
    id,
    label,
    value,
    validator,
    formControlProps,
    formLabelProps,
    ...props
}) => {
    const { t } = useTranslation('zod');

    const [hasBlurred, setHasBlurred] = useState(false);
    const [errorMsg, setErrorMsg] = useState('');

    return (
        <FormControl {...formControlProps}>
            {label.hasExtrenLabel && (
                <FormLabel htmlFor={id} {...formLabelProps}>
                    {label.value}
                </FormLabel>
            )}
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
                    const { success, error } = validator.Schema$.safeParse(
                        e.target.value
                    );
                    validator.setIsValid(success);
                    setErrorMsg(
                        error?.errors?.map((e) => t(e.message)).join(', ') ?? ''
                    );
                }}
                {...props}
            />
        </FormControl>
    );
};

export default BaseFieldWith$;
