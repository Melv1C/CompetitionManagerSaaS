import { useAtomValue } from "jotai";
//import { useTranslation } from "react-i18next";
import { competitionAtom, inscriptionsAtom } from "../../GlobalsStates";
import { Box, Card, Typography } from "@mui/material";
import { WysiwygViewer } from "../../Components";


export const Overview = () => {

    //const { t } = useTranslation();
    
    const competition = useAtomValue(competitionAtom);
    const inscriptions = useAtomValue(inscriptionsAtom);
    if (!competition) throw new Error('No competition found');
    if (!inscriptions) throw new Error('No inscriptions found');

    return (
        <Box>
            <Typography variant="h4">{competition.name}</Typography>
            <Card>
                <WysiwygViewer value={competition.description} />
            </Card>
        </Box>
    );
}
