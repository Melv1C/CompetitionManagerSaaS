import { CircleButton, Icons, MaxWidth } from '@/Components';
import {
    adminInscriptionsAtom,
    competitionAtom,
    inscriptionDataAtom,
} from '@/GlobalsStates';
import { deleteInscriptions } from '@/api';
import { useConfirmDialog, useSnackbar } from '@/hooks';
import { Athlete, EventType, Inscription } from '@competition-manager/schemas';
import { formatPerf, getCategoryAbbr } from '@competition-manager/utils';
import { faFileExport } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
    Alert,
    Box,
    DialogContentText,
    Divider,
    IconButton,
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
import { useMutation, useQueryClient } from 'react-query';
import { InscriptionPopup } from './InscriptionPopup';

export const Inscriptions = () => {
    const { t } = useTranslation();
    const { confirm } = useConfirmDialog();
    const { showSnackbar } = useSnackbar();
    const queryClient = useQueryClient();

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

    const handleTabChange = (
        _event: React.SyntheticEvent,
        newValue: number
    ) => {
        setTabValue(newValue);
    };

    // Delete mutation for handling inscription deletion
    const deleteMutation = useMutation(
        async ({ inscriptionEid }: { inscriptionEid: string }) => {
            return deleteInscriptions(competition.eid, inscriptionEid, true);
        },
        {
            onSuccess: () => {
                // Invalidate and refetch all related queries to ensure UI consistency
                queryClient.invalidateQueries([
                    'adminInscriptions',
                    competition.eid,
                ]);
                showSnackbar(
                    t('competition:inscriptionDeletedSuccess'),
                    'success'
                );
            },
            onError: () => {
                showSnackbar(t('errors:inscriptionDeleteFailed'), 'error');
            },
        }
    );

    // Handle the delete confirmation and action
    const handleDelete = async (inscription: Inscription) => {
        const confirmed = await confirm({
            title: t('competition:confirmDeleteInscription', { count: 1 }),
            message: (
                <DialogContentText>
                    {t('competition:confirmDeleteInscriptionMessage', {
                        athlete: `${inscription.athlete.firstName} ${inscription.athlete.lastName}`,
                        count: 1,
                    })}
                </DialogContentText>
            ),
            additionalContent: inscription.paid ? (
                <Alert severity="warning" sx={{ mt: 2 }}>
                    {t('competition:refundPolicyWarning')}
                </Alert>
            ) : undefined,
        });

        if (confirmed) {
            deleteMutation.mutateAsync({
                inscriptionEid: inscription.eid,
            });
        }
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

    // Function to transform inscriptions data into CSV format
    const generateCSV = (inscriptions: Inscription[]) => {
        const headers = [
            t('glossary:license'),
            t('glossary:bib'),
            t('glossary:firstName'),
            t('glossary:lastName'),
            t('glossary:clubs'),
            t('glossary:category'),
            t('glossary:event'),
            t('glossary:personalBest'),
        ].join(';');

        const rows = inscriptions.map((inscription) => {
            return [
                inscription.athlete.license,
                inscription.bib,
                inscription.athlete.firstName,
                inscription.athlete.lastName,
                inscription.club.abbr,
                getCategoryAbbr(
                    inscription.athlete.birthdate,
                    inscription.athlete.gender,
                    competition.date
                ),
                inscription.competitionEvent.name,
                inscription.record?.perf &&
                inscription.competitionEvent.event.type === EventType.TIME
                    ? inscription.record.perf / 1000
                    : inscription.record?.perf,
            ].join(';');
        });

        return [headers, ...rows].join('\n');
    };

    // Function to download CSV file
    const downloadCSV = () => {
        const inscriptions =
            tabValue === 0 ? activeInscriptions : deletedInscriptions;
        const csvContent = generateCSV(inscriptions);
        const blob = new Blob([csvContent], {
            type: 'text/csv;charset=utf-8;',
        });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.setAttribute('href', url);
        link.setAttribute(
            'download',
            `${
                competition.name
                    .normalize('NFD') // Remove accents
                    .replace(/[\s;]+/g, '') // Remove spaces and semicolons
            }_${
                competition.date
                    ? new Date(competition.date).toISOString().split('T')[0]
                    : ''
            }.csv`
        );
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

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
                        onClick={() => handleDelete(row)}
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
                        onClick={() =>
                            handleShowWarning(
                                'Restore',
                                `${row.id} ${row.athlete.firstName} ${row.athlete.lastName}: ${row.competitionEvent.name}`
                            )
                        }
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
                <Box
                    sx={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        width: '100%',
                    }}
                >
                    <Typography variant="h5">{competition.name}</Typography>
                    <IconButton
                        color="primary"
                        onClick={downloadCSV}
                        size="medium"
                    >
                        <FontAwesomeIcon icon={faFileExport} />
                    </IconButton>
                </Box>
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
