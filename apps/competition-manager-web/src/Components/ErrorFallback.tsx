import { Typography } from "@mui/material"
import { MaxWidth } from "./MaxWidth"
import { FallbackProps } from "react-error-boundary"



export const ErrorFallback: React.FC<FallbackProps> = ({ error }) => {
    return (
        <MaxWidth>
            <Typography variant="h1">Error</Typography>
            <Typography variant="body1">An error occurred. Please try again later.</Typography>
            <Typography variant="body2">{error.message}</Typography>
        </MaxWidth>
    )
}
