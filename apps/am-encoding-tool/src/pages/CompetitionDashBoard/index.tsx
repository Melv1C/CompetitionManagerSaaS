import { useEffect } from "react";
import { getCompetition } from "@/api";
import { useParams } from "react-router-dom";
import { Box } from "@mui/material";
import { competitionAtom } from "@/GlobalsStates";
import { useAtom } from "jotai";
import { AutoEncoding } from "./components/AutoEncoding";

export const CompetitionDashBoard = () => {
    const { competitionEid } = useParams();
    if (!competitionEid) return <Box>Loading...</Box>;
    const [competition, setCompetition] = useAtom(competitionAtom);

    useEffect(() => {
        const fetchCompetition = async () => {
            const data = await getCompetition(competitionEid);
            setCompetition(data);
        };

        fetchCompetition();
    }, [competitionEid]);

    return (
        <>
            <h1>{competition?.name}</h1>
            <Box>
                <AutoEncoding />
            </Box>
        </>
    )
}