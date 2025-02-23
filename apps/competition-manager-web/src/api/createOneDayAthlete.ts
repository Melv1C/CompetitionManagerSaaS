/**
 * File: apps/competition-manager-web/src/api/createOneDayAthlete.ts
 * 
 * This function handles the API call to create a one-day athlete.
 * It sends the athlete data to the server and returns the created athlete.
 */

import { Athlete$, CreateOneDayAthlete, Eid } from "@competition-manager/schemas";
import { api } from "../utils/api";

export const createOneDayAthlete = async (competitionEid: Eid, data: CreateOneDayAthlete) => {
    const { data: responseData } = await api.post(`/competitions/${competitionEid}/oneDayAthlete`, data);
    return Athlete$.parse(responseData);
} 