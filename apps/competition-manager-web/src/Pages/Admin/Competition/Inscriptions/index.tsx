import { CircleButton, Icons, MaxWidth } from '@/Components';
import {
    adminInscriptionsAtom,
    competitionAtom,
    inscriptionDataAtom,
} from '@/GlobalsStates';
import { Athlete, Inscription } from '@competition-manager/schemas';
import { formatPerf, getCategoryAbbr } from '@competition-manager/utils';
import {
    Alert,
    Box,
    Divider,
    Paper,
    Snackbar,
    Tab,
    Tabs,
    Typography,
} from '@mui/material';
import { DataGrid, GridColDef } from '@mui/x-data-grid';
import { useAtomValue, useSetAtom } from 'jotai';
import { useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { InscriptionPopup } from './InscriptionPopup';

export const Inscriptions = () => {
    const { t } = useTranslation();

    const competition = useAtomValue(competitionAtom);
    const adminInscriptions = useAtomValue(adminInscriptionsAtom);
    if (!competition) throw new Error('No competition found');
    if (!adminInscriptions) throw new Error('No inscriptions found');

    const [tabValue, setTabValue] = useState(0);
    const [snackbarOpen, setSnackbarOpen] = useState(false);
    const [snackbarMessage, setSnackbarMessage] = useState('');

    const handleShowWarning = (action: string, row: string) => {
        setSnackbarMessage(
            `${action} functionality not implemented yet (${row})`
        );
        setSnackbarOpen(true);
    };

    const handleCloseSnackbar = () => {
        setSnackbarOpen(false);
    };

    const handleTabChange = (_event: React.SyntheticEvent, newValue: number) => {
        setTabValue(newValue);
    };

    const activeInscriptions = useMemo(
        () =>
            [...adminInscriptions]
                .filter((inscription) => !inscription.isDeleted)
                .sort((a, b) => b.date.getTime() - a.date.getTime()),
        [adminInscriptions]
    );

    const deletedInscriptions = useMemo(
        () =>
            [...adminInscriptions]
                .filter((inscription) => inscription.isDeleted)
                .sort((a, b) => b.date.getTime() - a.date.getTime()),
        [adminInscriptions]
    );

    const setInscriptionData = useSetAtom(inscriptionDataAtom);

    const setAthlete = (athlete: Athlete | undefined) => {
        setInscriptionData({ athlete, inscriptionsData: [] });
    };

    const [isInscriptionPopupVisible, setIsInscriptionPopupVisible] =
        useState(false);

    const baseColumns: GridColDef[] = [
        {
            field: 'date',
            headerName: t('labels:date'),
            type: 'dateTime',
            width: 150,
        },
        {
            field: 'bib',
            headerName: t('glossary:bib'),
            type: 'number',
            width: 75,
        },
        {
            field: 'athlete',
            headerName: t('glossary:athlete'),
            width: 150,
            valueGetter: (value: Inscription['athlete']) =>
                value.firstName + ' ' + value.lastName,
        },
        {
            field: 'category',
            headerName: t('glossary:category'),
            width: 100,
            valueGetter: (_, row: Inscription) =>
                getCategoryAbbr(
                    row.athlete.birthdate,
                    row.athlete.gender,
                    competition.date
                ),
        },
        {
            field: 'club',
            headerName: t('glossary:clubs'),
            width: 75,
            valueGetter: (value: Inscription['club']) => value.abbr,
        },
        {
            field: 'competitionEvent',
            headerName: t('glossary:event'),
            width: 150,
            valueGetter: (value: Inscription['competitionEvent']) => value.name,
        },
        {
            field: 'record',
            headerName: t('glossary:personalBest'),
            type: 'number',
            width: 100,
            valueGetter: (value: Inscription['record']) => value?.perf,
            valueFormatter: (value: number, row: Inscription) =>
                value
                    ? formatPerf(value, row.competitionEvent.event.type)
                    : '-',
        },
        { field: 'status', headerName: t('labels:status'), width: 100 },
        {
            field: 'paid',
            headerName: t('labels:paid'),
            type: 'number',
            width: 50,
            valueFormatter: (value: Inscription['paid']) => `${value} €`,
        },
        {
            field: 'user',
            headerName: t('labels:email'),
            width: 200,
            valueGetter: (value: Inscription['user']) => value.email,
        },
    ];

    const activeColumns: GridColDef[] = [
        ...baseColumns,
        {
            field: 'actions',
            headerName: t('labels:actions'),
            width: 100,
            renderCell: ({ row }: { row: Inscription }) => (
                <Box>
                    <CircleButton
                        size="2rem"
                        color="primary"
                        onClick={() => {
                            setAthlete({ ...row.athlete, club: row.club });
                            setIsInscriptionPopupVisible(true);
                        }}
                    >
                        <Icons.Edit />
                    </CircleButton>
                    <CircleButton
                        size="2rem"
                        color="error"
                        onClick={() => handleShowWarning('Delete', `${row.id} ${row.athlete.firstName} ${row.athlete.lastName}: ${row.competitionEvent.name}`)}
                    >
                        <Icons.Delete />
                    </CircleButton>
                </Box>
            ),
        },
    ];

    const deletedColumns: GridColDef[] = [
        ...baseColumns,
        {
            field: 'actions',
            headerName: t('labels:actions'),
            width: 100,
            renderCell: ({ row }: { row: Inscription }) => (
                <Box>
                    <CircleButton
                        size="2rem"
                        color="success"
                        onClick={() => handleShowWarning('Restore', `${row.id} ${row.athlete.firstName} ${row.athlete.lastName}: ${row.competitionEvent.name}`)}
                    >
                        <Icons.Refresh />
                    </CircleButton>
                </Box>
            ),
        },
    ];

    return (
        <MaxWidth maxWidth="xl">
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
                <Icons.Add size="3x" />
            </CircleButton>
            {isInscriptionPopupVisible && (
                <InscriptionPopup
                    isVisible={isInscriptionPopupVisible}
                    onClose={() => setIsInscriptionPopupVisible(false)}
                />
            )}

            <Snackbar
                open={snackbarOpen}
                autoHideDuration={6000}
                onClose={handleCloseSnackbar}
                anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
            >
                <Alert
                    onClose={handleCloseSnackbar}
                    severity="warning"
                    sx={{ width: '100%' }}
                >
                    {snackbarMessage}
                </Alert>
            </Snackbar>

            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                <Typography variant="h5">{competition.name}</Typography>

                <Divider />

                <Paper sx={{ width: '100%', mb: 2 }}>
                    <Tabs
                        value={tabValue}
                        onChange={handleTabChange}
                        indicatorColor="primary"
                        textColor="primary"
                        variant="fullWidth"
                    >
                        <Tab
                            label={`${t('labels:active')} (${
                                activeInscriptions.length
                            })`}
                            id="tab-0"
                        />
                        <Tab
                            label={`${t('labels:deleted')} (${
                                deletedInscriptions.length
                            })`}
                            id="tab-1"
                        />
                    </Tabs>
                </Paper>

                {tabValue === 0 ? (
                    <DataGrid
                        columns={activeColumns}
                        rows={activeInscriptions}
                        initialState={{
                            columns: {
                                columnVisibilityModel: {
                                    date: false,
                                },
                            },
                        }}
                        sx={{ height: 'calc(100vh - 250px)' }}
                    />
                ) : (
                    <DataGrid
                        columns={deletedColumns}
                        rows={deletedInscriptions}
                        initialState={{
                            columns: {
                                columnVisibilityModel: {
                                    date: false,
                                },
                            },
                        }}
                        sx={{
                            height: 'calc(100vh - 250px)',
                            '& .MuiDataGrid-row': {
                                opacity: 0.7,
                            },
                        }}
                    />
                )}
            </Box>
        </MaxWidth>
    );
};
