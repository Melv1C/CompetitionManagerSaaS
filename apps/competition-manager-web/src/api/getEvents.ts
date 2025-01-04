import { Event$ } from "@competition-manager/schemas";
import { api } from "../utils/api";

export const getEvents = async () => {
    const { data } = await api.get('/events');
    return Event$.array().parse(data);
}