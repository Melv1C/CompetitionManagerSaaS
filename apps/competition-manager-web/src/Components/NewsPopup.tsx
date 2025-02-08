import { useState, useEffect } from "react";
import { useLocalStorage } from "usehooks-ts";
import { Dialog, DialogTitle, DialogContent, DialogActions, Button } from "@mui/material";
import { useQuery } from "react-query";
import { getAllNews } from "../api";
import { Id, News } from "@competition-manager/schemas";
import { useTranslation } from "react-i18next";
import { WysiwygViewer } from "./WYSIWYG";
import i18n from "../i18n";

export const NewsPopup = () => {
    const { t } = useTranslation('buttons');
    const [seenNews, setSeenNews] = useLocalStorage<Id[]>("seenNewsUpdates", []);
    const [currentNews, setCurrentNews] = useState<News | null>(null);

    const { data: newsList = [], isLoading, error } = useQuery("news", getAllNews);

    useEffect(() => {
        if (!isLoading && !error) {
            // Cleanup: Remove outdated news slugs
            const validNewsIds = newsList.map(news => news.id);
            const cleanedSeenNews = seenNews.filter(id => validNewsIds.includes(id));

            if (JSON.stringify(cleanedSeenNews) !== JSON.stringify(seenNews)) {
                setSeenNews(cleanedSeenNews);
            }

            // Find the first unseen news
            const unseenNews = newsList.filter(news => i18n.language === news.language).find(news => !cleanedSeenNews.includes(news.id));
            if (unseenNews) {
                setCurrentNews(unseenNews);
            }
        }
    }, [newsList, seenNews, isLoading, error]);

    const handleClose = () => {
        if (currentNews) {
            setSeenNews(prev => [...prev, currentNews.id]);
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
