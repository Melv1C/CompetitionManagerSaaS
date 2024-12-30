import { Box } from "@mui/material"
import { PropsWithChildren } from "react"

export const ScrollablePage: React.FC<PropsWithChildren<{}>> = ({ children }) => {
    return (
        <Box
            sx={{
                display: 'flex',
                width: '100%',
                height: '100%',
                overflow: 'auto',
            }}
        >
            {children}
        </Box>
    )
}
