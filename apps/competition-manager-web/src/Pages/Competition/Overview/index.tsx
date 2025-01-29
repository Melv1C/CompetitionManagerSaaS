import { Box } from "@mui/material";
import { Infos } from "./Infos";
import { Descriptions } from "./Descriptions";
import { Events } from "./Events";


export const Overview = () => {

    return (
        <Box 
            sx={{
                display: 'flex',
                flexWrap: 'wrap',
                justifyContent: 'center',
                alignItems: 'center',
                gap: 2
            }}
        >
            <Infos />
            <Descriptions />
            <Events />
        </Box>
    );
}
