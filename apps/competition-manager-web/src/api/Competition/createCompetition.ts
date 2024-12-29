import { BaseCompetitionWithRelationId, Competition$ } from "@competition-manager/schemas";
//import { api } from "../../utils/api";

import axios from "axios";
const api = axios.create({
    baseURL: 'http://localhost:3000/api',
});

// Add a request interceptor to add the access token to each request
api.interceptors.request.use((config) => {

    // If the access token is not null, add it to the Authorization header
    console.log(import.meta.env.VITE_LOCAL_ACCESS_TOKEN);
    if (import.meta.env.VITE_LOCAL_ACCESS_TOKEN) {
        config.headers.Authorization = `Bearer ${import.meta.env.VITE_LOCAL_ACCESS_TOKEN}`;
    }

    return config;
});


export const createCompetition = async (competition: BaseCompetitionWithRelationId) => {
    const { data } = await api.post('/competitions', competition);
    return Competition$.parse(data);
}