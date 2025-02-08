import { useState, useEffect } from "react";
import { useLocalStorage } from "usehooks-ts";
import { Dialog, DialogTitle, DialogContent, DialogActions, Button } from "@mui/material";
import { useQuery } from "react-query";
import { getAllNews } from "../api";
import { News } from "@competition-manager/schemas";
import { useTranslation } from "react-i18next";
import { WysiwygViewer } from "./WYSIWYG";

export const NewsPopup = () => {
    const { t } = useTranslation('buttons');
    const [seenNews, setSeenNews] = useLocalStorage<string[]>("seenNewsUpdates", []);
    const [currentNews, setCurrentNews] = useState<News | null>(null);

    const { data: newsList = [], isLoading, error } = useQuery("news", getAllNews);

    useEffect(() => {
        if (!isLoading && !error) {
            // Cleanup: Remove outdated news slugs
            const validNewsSlugs = newsList.map(news => news.slug);
            const cleanedSeenNews = seenNews.filter(slug => validNewsSlugs.includes(slug));

            if (JSON.stringify(cleanedSeenNews) !== JSON.stringify(seenNews)) {
                setSeenNews(cleanedSeenNews);
            }

            // Find the first unseen news
            const unseenNews = newsList.find(news => !cleanedSeenNews.includes(news.slug));
            if (unseenNews) {
                setCurrentNews(unseenNews);
            }
        }
    }, [newsList, seenNews, isLoading, error]);

    const handleClose = () => {
        if (currentNews) {
            setSeenNews(prev => [...prev, currentNews.slug]);
        }
        setCurrentNews(null);
    };

    if (isLoading || error) return null; // Don't render until data is ready

    return (
        <Dialog open={!!currentNews} onClose={handleClose} maxWidth="sm" fullWidth>
            <DialogTitle>{currentNews?.title}</DialogTitle>
            <DialogContent>
                <WysiwygViewer value={currentNews?.content || ""} />
            </DialogContent>
            <DialogActions>
                <Button onClick={handleClose} color="primary" variant="contained">
                    {t('gotIt')}
                </Button>
            </DialogActions>
        </Dialog>
    );
};
