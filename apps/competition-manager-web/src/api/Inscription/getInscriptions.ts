
import { Eid, Inscription$ } from "@competition-manager/schemas";
//import { api } from "../../utils/api";

export const getInscriptions = async (competitionEid: Eid) => {
    console.log(competitionEid);
    return Inscription$.array().parse([]);
    // const { data } = await api.get(`/competitions/${competitionEid}/inscriptions`);
    // return Inscription$.array().parse(data);
}