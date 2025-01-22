import { Event, Records$ } from "@competition-manager/schemas";
import { api } from "../utils/api";

export const getRecords = async (license: string, events: Event["name"][], from?: Date, to?: Date) => {
    const { data } = await api.get(`/athletes/${license}/records`, {
        params: { 
            events: JSON.stringify(events),
            from, 
            to 
        } 
    });
    return Records$.parse(data);
}
