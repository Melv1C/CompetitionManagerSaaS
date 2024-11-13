import { Box } from "@mui/material";
import { useParams } from "react-router-dom";


export const AdminCompetition = () => {


    const { id } = useParams();

    return (
        <Box>
            <h1>Competition ID: {id}</h1>
        </Box>
    );
}
