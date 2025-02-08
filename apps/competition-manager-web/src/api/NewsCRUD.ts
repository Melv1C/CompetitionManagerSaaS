
import { CreateNews, Id, News$ } from "@competition-manager/schemas";
import { api } from "../utils/api";

export const getAllNews = async () => {
    const { data } = await api.get('/news');
    return News$.array().parse(data);
}

export const createNews = async (news: CreateNews) => {
    const { data } = await api.post('/news', news);
    return News$.parse(data);
}

export const updateNews = async (newsId: Id, news: CreateNews) => {
    const { data } = await api.put(`/news/${newsId}`, news);
    return News$.parse(data);
}

export const deleteNews = async (newsId: Id) => {
    await api.delete(`/news/${newsId}`);
}