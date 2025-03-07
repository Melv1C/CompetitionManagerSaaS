import { Box, Button } from "@mui/material";
import { useState } from "react";
import { FilePopup } from "./FilePopup";

export const Results = () => {
    const [filePopupVisible, setFilePopupVisible] = useState(false);


    return (
        <Box sx={{ padding: 2 }}>
            <Button onClick={() => setFilePopupVisible(true)}>Open file popup</Button>
            {filePopupVisible && <FilePopup open={filePopupVisible} onClose={() => setFilePopupVisible(false)} />}
        </Box>
    );
};