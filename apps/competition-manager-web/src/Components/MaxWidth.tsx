import { Breakpoint, Container, SxProps } from "@mui/material"
import { PropsWithChildren } from "react"

type MaxWidthProps = PropsWithChildren<{
    maxWidth?: Breakpoint,
    sx?: SxProps
}>

export const MaxWidth: React.FC<MaxWidthProps> = ({ 
    maxWidth = 'md',
    children,
    sx = {}
}) => {
    return (
        <Container 
            maxWidth={maxWidth} 
            sx={{ 
                my: 4,
                ...sx
            }}
        >
            {children}
        </Container>
    )
}
