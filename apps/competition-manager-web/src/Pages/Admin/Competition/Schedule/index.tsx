import { Box } from "@mui/material";
import { DataGrid, GridColDef } from '@mui/x-data-grid';
import { Add, CircleButton } from "../../../../Components";
import { useAtomValue } from "jotai";
import { competitionAtom } from "../../../../GlobalsStates";
import { CompetitionEvent } from "@competition-manager/schemas";
import { useState } from "react";
import { CreatePopup } from "./CreatePopop";



export const Schedule = () => {

    const competition = useAtomValue(competitionAtom);
    if (!competition) throw new Error('No competition found');
    const events = competition.events

    const [isCreatePopupVisible, setIsCreatePopupVisible] = useState(false);

    const columns: GridColDef[] = [
        { field: 'id', headerName: 'ID', width: 90 },
        { field: 'name', headerName: 'Name', width: 150 },
        { field: 'date', headerName: 'Date', width: 150, valueGetter: (_, row: CompetitionEvent) => row.schedule.toLocaleDateString() },
        { field: 'time', headerName: 'Time', width: 150, valueGetter: (_, row: CompetitionEvent) => row.schedule.toLocaleTimeString() },
        { field: 'categories', headerName: 'Categories', width: 200, valueFormatter: (value: string[]) => value.join(', ') },
        { field: 'actions', headerName: 'Actions', width: 150 },
    ];

    return (
        <Box>
            <CircleButton 
                size="4rem"
                sx={{ 
                    position: 'fixed',
                    bottom: '1rem',
                    right: '1rem'
                }}
                variant="contained"
                color="secondary"
                onClick={() => setIsCreatePopupVisible(true)}
            >
                <Add size="3x" />
            </CircleButton>
            {isCreatePopupVisible && (
                <CreatePopup 
                    isVisible={isCreatePopupVisible}
                    onClose={() => setIsCreatePopupVisible(false)}
                />
            )}
            <DataGrid
                rows={events}
                columns={columns}
            />
        </Box>
    );
}
