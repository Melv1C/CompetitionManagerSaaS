import { InputAdornment } from '@mui/material';
import { BaseFieldWith$, BaseFieldWith$Props } from './BaseFieldWith$';

type FieldIconWith$Props = BaseFieldWith$Props & {
    icon: React.ReactNode;
    iconPosition?: 'start' | 'end';
};

export const FieldIconWith$: React.FC<FieldIconWith$Props> = ({
    icon,
    iconPosition = 'end',
    ...props
}) => {
    return (
        <BaseFieldWith$
            {...props}
            slotProps={{
                input: {
                    [`${iconPosition}Adornment`]: (
                        <InputAdornment position={iconPosition}>
                            {icon}
                        </InputAdornment>
                    ),
                },
            }}
        />
    );
};
