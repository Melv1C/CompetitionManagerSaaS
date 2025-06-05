import { useEffect, useState } from "react";
import { Competition } from "@competition-manager/schemas";
import { getCompetition } from "@/api";
import { useParams } from "react-router-dom";

export const CompetitionDashBoard = () => {
    const { competitionEid } = useParams();
    if (!competitionEid) throw new Error('No competition EID provided');
    
    const [competition, setCompetition] = useState<Competition | null>(null);

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
        </>
    )
}