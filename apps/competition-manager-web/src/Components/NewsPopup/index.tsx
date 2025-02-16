import { useLocalStorage } from "usehooks-ts";
import { Dialog } from "@mui/material";

import { Welcom } from "./Welcom";

const NEWS = [
    {
        id: "welcom",
        component: Welcom,
    },
];

export type NewsProps = {
    handleClose: () => void;
}

export const NewsPopup = () => {
    const [seenNews, setSeenNews] = useLocalStorage<string[]>("seenNewsUpdates", []);
    const currentNews = NEWS.find((news) => !seenNews.includes(news.id));

    const handleClose = () => {
        if (currentNews) {
            setSeenNews([...seenNews, currentNews.id]);
        }
    };

    if (!currentNews) {
        return null;
    }

    return (
        <Dialog 
            open={true} 
            onClose={handleClose}
            fullWidth
            maxWidth="sm"
        >
            <currentNews.component handleClose={handleClose} />
        </Dialog>
    );
};
