import { BaseFieldWith$, BaseFieldWith$Props } from './BaseFieldWith$';

type TextFieldWith$Props = BaseFieldWith$Props & {
    multiline?: boolean;
};

export const TextFieldWith$: React.FC<TextFieldWith$Props> = ({
    multiline = false,
    ...props
}) => {
    return (
        <BaseFieldWith$
            {...props}
            slotProps={{
                input: {
                    multiline: multiline,
                    rows: 4,
                },
            }}
        />
    );
};
