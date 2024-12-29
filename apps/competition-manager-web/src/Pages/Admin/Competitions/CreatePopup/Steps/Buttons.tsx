import { Box, Button } from '@mui/material'
import React from 'react'

type ButtonProps = {
    label: string
    onClick: () => void
    disabled?: boolean
    isSubmit?: boolean
}

type ButtonsProps = {
    buttons: ButtonProps[]
}

export const Buttons: React.FC<ButtonsProps> = ({ buttons }) => {
    return (
        <Box sx={{ display: 'flex', gap: '1rem', mt: 4 }}>
            {buttons.map(({ label, onClick, disabled, isSubmit }) => (
                <Button 
                    key={label}
                    variant="contained" 
                    onClick={onClick}
                    disabled={disabled}
                    type={isSubmit ? 'submit' : 'button'}
                >
                    {label}
                </Button>
            ))}
        </Box>
    )
}
