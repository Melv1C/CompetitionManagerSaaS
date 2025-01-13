import { Club$ } from "@competition-manager/schemas";
import { api } from "../utils/api";

export const getClubs = async () => {
    const { data } = await api.get('/clubs');
    return Club$.array().parse(data);
}