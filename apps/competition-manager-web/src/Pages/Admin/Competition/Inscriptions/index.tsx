import { Box, Divider, FormControl, TextField } from "@mui/material"
import { Add, CircleButton, Delete, Edit, MaxWidth } from "../../../../Components"
import { useTranslation } from "react-i18next";
import { useAtomValue, useSetAtom } from "jotai";
import { adminInscriptionsAtom, competitionAtom, inscriptionDataAtom } from "../../../../GlobalsStates";
import { Athlete, Inscription } from "@competition-manager/schemas";
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
        { field: 'athlete', headerName: t('glossary:athlete'), width: 150,
            valueGetter: (value: Inscription["athlete"]) => value.firstName + ' ' + value.lastName
        },
        { field: 'category', headerName: t('glossary:category'), width: 100, 
            valueGetter: (_, row: Inscription) => getCategoryAbbr(row.athlete.birthdate, row.athlete.gender, competition.date)
        },
        { field: 'club', headerName: t('glossary:clubs'), width: 75,
            valueGetter: (value: Inscription["club"]) => value.abbr
        },
        { field: 'competitionEvent', headerName: t('glossary:event'), width: 150,
            valueGetter: (value: Inscription["competitionEvent"]) => value.name
        },
        { field: 'record', headerName: t('glossary:personalBest'), type: 'number', width: 100,
            valueGetter: (value: Inscription["record"]) => value?.perf,
            valueFormatter: (value: number, row: Inscription) => value ? formatPerf(value, row.competitionEvent.event.type) : '-'
        },
        { field: 'status', headerName: t('labels:status'), width: 100 },
        { field: 'paid', headerName: t('labels:paid'), type: 'number', width: 50,
            valueFormatter: (value: Inscription["paid"]) => `${value} €`
        },
        { field: 'user', headerName: t('labels:email'), width: 200,
            valueGetter: (value: Inscription["user"]) => value.email
        },
        { field: 'actions', headerName: t('labels:actions'), width: 100,
            renderCell: ({ row }: { row: Inscription }) => (
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
            )
        },
    ];

    return (
        <MaxWidth maxWidth="lg">
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
