import { Box } from "@mui/material"
import { MaxWidth } from "../../Components";
import { Infos } from "./Infos";


export const Account = () => {

    return (
        <MaxWidth>
            <Box 
                sx={{
                    display: 'flex',
                    gap: '1rem',
                    justifyContent: 'center',
                    alignItems: 'center',
                }}
            >
                <Infos />
            </Box>

        </MaxWidth>
    )
}
