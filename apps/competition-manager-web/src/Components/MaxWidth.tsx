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
                width: `calc(100% - 2rem)`,
                maxWidth: maxWidth,
                margin: 'auto',
                padding: '1rem'
            }}
        >
            {children}
        </Box>
    )
}
