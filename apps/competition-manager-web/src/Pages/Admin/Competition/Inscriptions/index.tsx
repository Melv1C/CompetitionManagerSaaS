import { Box, Divider, FormControl, TextField } from "@mui/material"
import { Add, CircleButton, Delete, Edit, MaxWidth } from "../../../../Components"
import { useTranslation } from "react-i18next";
import { useAtomValue, useSetAtom } from "jotai";
import { adminInscriptionsAtom, competitionAtom, inscriptionDataAtom } from "../../../../GlobalsStates";
import { Athlete, Club, Inscription } from "@competition-manager/schemas";
import { useMemo, useState } from "react";
import { InscriptionPopup } from "./InscriptionPopup";
import { DataGrid, GridColDef } from "@mui/x-data-grid";
import { getCategoryAbbr } from "@competition-manager/utils";
import { formatPerf } from "../../../../utils";


export const Inscriptions = () => {

    const { t } = useTranslation();

    const competition = useAtomValue(competitionAtom);
    const adminInscriptions = useAtomValue(adminInscriptionsAtom);
    if (!competition) throw new Error('No competition found');
    if (!adminInscriptions) throw new Error('No inscriptions found');

    const sortInscriptions = useMemo(() => adminInscriptions.sort((a, b) => b.date.getTime() - a.date.getTime()), [adminInscriptions]);

    const setInscriptionData = useSetAtom(inscriptionDataAtom);
    
    const setAthlete = (athlete: Athlete | undefined) => {
        setInscriptionData({ athlete, inscriptionsData: [] });
    }

    const [isInscriptionPopupVisible, setIsInscriptionPopupVisible] = useState(false);

    const columns: GridColDef[] = [
        { field: 'date', headerName: t('labels:date'), type: 'dateTime' , width: 150 },
        { field: 'bib', headerName: t('glossary:bib'), type: 'number' , width: 75 },
        { field: 'athlete', headerName: t('glossary:athlete'), valueFormatter: (value: Inscription["athlete"]) => value.firstName + ' ' + value.lastName, width: 150 },
        { field: 'category', headerName: t('glossary:category'), valueGetter: (_, row: Inscription) => getCategoryAbbr(row.athlete.birthdate, row.athlete.gender, competition.date), width: 100 },
        { field: 'club', headerName: t('glossary:clubs'), valueFormatter: (value: Club) => value.abbr, width: 75 },
        { field: 'competitionEvent', headerName: t('glossary:event'), valueFormatter: (value: Inscription["competitionEvent"]) => value.name, width: 150 },
        { field: 'record', headerName: t('glossary:personalBest'), type: 'number', valueFormatter: (value: Inscription["record"], row: Inscription) => value?.perf ? formatPerf(value.perf, row.competitionEvent.event.type) : '-', width: 100 },
        { field: 'status', headerName: t('labels:status'), width: 100 },
        { field: 'paid', headerName: t('labels:paid'), type: 'number', valueFormatter: (value: Inscription["paid"]) => `${value} €`, width: 50 },
        { field: 'user', headerName: t('labels:email'), valueFormatter: (value: Inscription["user"]) => value.email, width: 200 },
        { field: 'actions', headerName: t('labels:actions'), renderCell: ({ row }: { row: Inscription }) => (
            <Box>
                <CircleButton size="2rem" color="primary" onClick={() => {
                    setAthlete({ ...row.athlete, club: row.club });
                    setIsInscriptionPopupVisible(true);
                }}>
                    <Edit />
                </CircleButton>
                <CircleButton size="2rem" color="error" onClick={() => console.log('delete', row.id)}>
                    <Delete />
                </CircleButton>
            </Box>
        ), width: 100 },
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
                    setAthlete(undefined);
                    setIsInscriptionPopupVisible(true);
                }}
            >
                <Add size="3x" />
            </CircleButton>
            {isInscriptionPopupVisible && (
                <InscriptionPopup 
                    isVisible={isInscriptionPopupVisible}
                    onClose={() => setIsInscriptionPopupVisible(false)}
                />
            )}

            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                <FormControl>
                    <TextField
                        label={t('glossary:competition')}
                        value={competition.name}
                        slotProps={{ input: { readOnly: true } }}

                    />
                </FormControl>

                <Divider />

                <DataGrid
                    columns={columns}
                    rows={sortInscriptions}
                    initialState={{ 
                        columns: {
                            columnVisibilityModel: {
                                date: false,
                            },
                        }
                    }}
                />
            </Box>

        </MaxWidth>
    )
}
