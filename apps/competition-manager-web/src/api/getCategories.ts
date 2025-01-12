
import { Category$ } from "@competition-manager/schemas";
import { api } from "../utils/api";

export const getCategories = async () => {
    const { data } = await api.get('/categories');
    return Category$.array().parse(data);
}