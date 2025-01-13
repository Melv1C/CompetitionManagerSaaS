import { Badge, Box, Divider, FormControl, TextField } from "@mui/material";
import { DataGrid, GridColDef } from '@mui/x-data-grid';
import { Add, CircleButton, Delete, Edit, MaxWidth, Users } from "../../../../Components";
import { useAtomValue } from "jotai";
import { competitionAtom, inscriptionsAtom } from "../../../../GlobalsStates";
import { useState } from "react";
import { EventPopup } from "./EventPopup";
import { CompetitionEvent, CompetitionEvent$ } from "@competition-manager/schemas";

export const Schedule = () => {

    const competition = useAtomValue(competitionAtom);
    const inscriptions = useAtomValue(inscriptionsAtom);

    if (!competition) throw new Error('No competition found');
    if (!inscriptions) throw new Error('No inscriptions found');

    const events = competition.events

    const [isEventPopupVisible, setIsEventPopupVisible] = useState(false);
    const [selectedEvent, setSelectedEvent] = useState<CompetitionEvent>();

    const columns: GridColDef[] = [
        { 
            field: 'schedule', 
            headerName: 'Time', 
            width: 100, 
            valueFormatter: (value: Date) => {
                if (competition.closeDate) {
                    return value.toLocaleDateString() + ' ' + value.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
                }
                return value.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
            }
        },
        { field: 'name', headerName: 'Name', width: 150 },
        { field: '', headerName: 'Inscriptions', width: 100, valueGetter: (_, row) => {
            const inscriptionsCount = inscriptions.filter(i => i.competitionEvent.id === row.id).length;
            return inscriptionsCount;
        }, renderCell: (params) => (
            <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%' }}>
                <Badge badgeContent={params.value} color="info" showZero max={999} overlap="circular">
                    <Box 
                        sx={{ 
                            display: 'flex',
                            justifyContent: 'center',
                            alignItems: 'center',
                            width: '1.5rem',
                            height: '1.5rem',
                            padding: '0.5rem',
                        }}
                    >
                        <Users size="lg" />
                    </Box>
                </Badge>
            </Box>
        )},
        { field: 'place', headerName: 'Place', width: 100 },
        { field: 'cost', headerName: 'Cost', width: 100, valueFormatter: (value: number) => {
            if (value === 0) return 'Free';
            return value + '€';
        }},
        { field: 'actions', headerName: 'Actions', width: 150, renderCell: (params) => (
            <Box>
                <CircleButton size="2rem" color="primary" onClick={() => {
                    setSelectedEvent(CompetitionEvent$.parse(params.row));
                    setIsEventPopupVisible(true);
                }}>
                    <Edit />
                </CircleButton>
                <CircleButton size="2rem" color="error" onClick={() => console.log('delete', params.row.id)}>
                    <Delete />
                </CircleButton>
            </Box>
        )}
    ];

    return (
        <MaxWidth>
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
                onClick={() => {
                    setSelectedEvent(undefined);
                    setIsEventPopupVisible(true);
                }}
            >
                <Add size="3x" />
            </CircleButton>
            {isEventPopupVisible && (
                <EventPopup 
                    isVisible={isEventPopupVisible}
                    onClose={() => setIsEventPopupVisible(false)}
                    initialEvent={selectedEvent}
                />
            )}

            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                <FormControl>
                    <TextField
                        label="Name"
                        value={competition.name}
                        slotProps={{ input: { readOnly: true } }}

                    />
                </FormControl>

                <Divider />

                <DataGrid
                    rows={events}
                    columns={columns}
                    initialState={{ 
                        sorting: {
                            sortModel: [{ field: 'schedule', sort: 'asc' }],
                        }
                    }}
                />
            </Box>
        </MaxWidth>
    );
}
