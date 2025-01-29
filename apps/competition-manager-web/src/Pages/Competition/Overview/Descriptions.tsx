import { Card } from "@mui/material";
import { WysiwygViewer } from "../../../Components";
import { useAtomValue } from "jotai";
import { competitionAtom } from "../../../GlobalsStates";


export const Descriptions = () => {

    const competition = useAtomValue(competitionAtom);
    if (!competition) throw new Error('No competition found');

    if (!competition.description) return null;

    return (
        <Card
            sx={{
                minWidth: 250,
                maxWidth: 500,
                height: 'fit-content',
            }}
        >
            <WysiwygViewer value={competition.description} />
        </Card>
    )
}
