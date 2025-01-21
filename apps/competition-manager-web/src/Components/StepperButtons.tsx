import { Box, BoxProps, Button, ButtonProps } from '@mui/material'
import React from 'react'

type MyButtonProps = {
    label: string
    onClick: () => void
    variant?: ButtonProps['variant']
    disabled?: boolean
    isSubmit?: boolean
}

type StepperButtonsProps = BoxProps & {
    buttons: MyButtonProps[]
    buttonProps?: ButtonProps
}

export const StepperButtons: React.FC<StepperButtonsProps> = ({ 
    buttons,
    buttonProps,
    ...props
}) => {
    return (
        <Box display="flex" mt={2} gap={2} justifyContent={buttons.length === 1 ? 'flex-end' : 'space-between'} {...props}>
            {buttons.map(({ label, onClick, variant, disabled, isSubmit }) => (
                <Button 
                    key={label}
                    onClick={onClick}
                    variant={variant || 'contained'}
                    disabled={disabled}
                    type={isSubmit ? 'submit' : 'button'}
                    {...buttonProps}
                >
                    {label}
                </Button>
            ))}
        </Box>
    )
}
