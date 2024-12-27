import { Box } from "@mui/material"
import { PropsWithChildren } from "react"
import { DEFAULT_MAX_WIDTH } from "../utils/constants"

type MaxWidthProps = PropsWithChildren<{
    maxWidth?: string
}>

export const MaxWidth: React.FC<MaxWidthProps> = ({ 
    maxWidth = DEFAULT_MAX_WIDTH,
    children 
}) => {
    return (
        <Box
            sx={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                width: '100%',
                maxWidth: maxWidth,
                margin: 'auto',
            }}
        >
            {children}
        </Box>
    )
}
