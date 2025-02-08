
import { CreateNews, News$ } from "@competition-manager/schemas";
import { api } from "../utils/api";

export const getAllNews = async () => {
    const { data } = await api.get('/news');
    return News$.array().parse(data);
}

export const createNews = async (news: CreateNews) => {
    const { data } = await api.post('/news', news);
    return News$.parse(data);
}