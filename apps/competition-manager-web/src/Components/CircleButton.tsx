import { Button, ButtonProps } from "@mui/material"
import { ReactNode } from "react"

type CircleButtonProps = Omit<ButtonProps, 'size'> & {
    size?: string
    children: ReactNode
}

export const CircleButton: React.FC<CircleButtonProps> = ({
    children,
    size = '3rem',
    sx,
    ...props
}) => {
    return (
        <Button 
            sx={{
                borderRadius: '50%',
                width: size,
                minWidth: size,
                height: size,
                ...sx
            }}
            {...props}
        >
            {children}
        </Button>
    )
}
