import { useQuery } from "react-query"
import { Add, CircleButton, MaxWidth } from "../../../Components"
import { getAllNews } from "../../../api"
import { DataGrid } from "@mui/x-data-grid";
import { useState } from "react";
import { Popup } from "./Popup";


export const News = () => {

    const {
        data: news,
        isLoading,
        isError,
    } = useQuery('news', getAllNews);

    const [isPopupOpen, setIsPopupOpen] = useState(false);

    //if (isError) throw new Error('Error fetching news');

    return (
        <MaxWidth>
            <DataGrid
                rows={news}
                columns={[
                    { field: 'id', headerName: 'ID', width: 75 },
                    { field: 'slug', headerName: 'Slug', width: 200 },
                    { field: 'language', headerName: 'Language', width: 200 },
                    { field: 'title', headerName: 'Title', width: 200 },
                    { field: 'content', headerName: 'Content', width: 200 },
                    { field: 'date', headerName: 'Date', width: 200 },
                ]}
                loading={isLoading}
            />

            <CircleButton 
                size="4rem"
                sx={{ 
                    position: 'fixed',
                    bottom: '1rem',
                    right: '1rem',
                    zIndex: 10,
                }}
                variant="contained"
                color="secondary"
                onClick={() => setIsPopupOpen(true)}
            >
                <Add size="3x" />
            </CircleButton>
            <Popup open={isPopupOpen} onClose={() => setIsPopupOpen(false)} />
        </MaxWidth>
    )
}
