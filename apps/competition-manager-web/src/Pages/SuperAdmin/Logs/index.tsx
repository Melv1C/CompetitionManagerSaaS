import { getLogs } from '@/api';
import { MaxWidth } from '@/Components';
import { LEVEL, SERVICE } from '@competition-manager/schemas';
import { faTimes } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
    Box,
    Button,
    Chip,
    Dialog,
    DialogContent,
    DialogTitle,
    Divider,
    IconButton,
    Paper,
    Tooltip,
    Typography,
} from '@mui/material';
import { DataGrid, GridColDef } from '@mui/x-data-grid';
import { useState } from 'react';
import { useQuery } from 'react-query';
import { Selector } from './Selector';

export const Logs = () => {
    const [services, setServices] = useState<SERVICE[]>(Object.values(SERVICE));
    const [levels, setLevels] = useState<LEVEL[]>(Object.values(LEVEL));
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const [selectedRow, setSelectedRow] = useState<any | null>(null);
    const [modalOpen, setModalOpen] = useState(false);

    const isDisabled = services.length === 0 || levels.length === 0;

    const {
        data: logs = [],
        isLoading,
        isError,
        refetch,
    } = useQuery('logs', () => getLogs(levels, services, {}), {
        enabled: false,
    });
    if (isError) throw new Error('Error fetching logs');

    const columns: GridColDef[] = [
        { field: 'id', headerName: 'ID', width: 75, type: 'number' },
        { field: 'date', headerName: 'Date', width: 175, type: 'dateTime' },
        {
            field: 'level',
            headerName: 'Level',
            width: 90,
            renderCell: (params) => {
                switch (params.value) {
                    case LEVEL.error:
                        return (
                            <Chip
                                label={params.value}
                                color="error"
                                size="small"
                            />
                        );
                    case LEVEL.warn:
                        return (
                            <Chip
                                label={params.value}
                                color="warning"
                                size="small"
                            />
                        );
                    case LEVEL.info:
                        return (
                            <Chip
                                label={params.value}
                                color="info"
                                size="small"
                            />
                        );
                    case LEVEL.http:
                        return (
                            <Chip
                                label={params.value}
                                color="primary"
                                size="small"
                            />
                        );
                    default:
                        return (
                            <Chip
                                label={params.value}
                                color="secondary"
                                size="small"
                            />
                        );
                }
            },
        },
        { field: 'service', headerName: 'Service', width: 120 },
        { field: 'path', headerName: 'Path', width: 180 },
        { field: 'status', headerName: 'Status', width: 90, type: 'number' },
        { field: 'userId', headerName: 'User ID', width: 90, type: 'number' },
        { field: 'message', headerName: 'Message', width: 220 },
        {
            field: 'metadata',
            headerName: 'Metadata',
            width: 120,
            renderCell: (params) => (
                <Tooltip title="View metadata">
                    <Button
                        size="small"
                        variant="outlined"
                        onClick={(e) => {
                            e.stopPropagation();
                            setSelectedRow(params.row);
                            setModalOpen(true);
                        }}
                    >
                        View
                    </Button>
                </Tooltip>
            ),
        },
    ];

    return (
        <MaxWidth maxWidth="xl">
            <Box
                component={Paper}
                sx={{
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '1rem',
                    p: 2,
                }}
            >
                <Typography variant="h4">Filters</Typography>

                <Selector
                    label="Services"
                    items={Object.values(SERVICE)}
                    selectedItems={services}
                    setSelectedItems={(items) =>
                        setServices(items as SERVICE[])
                    }
                />
                <Selector
                    label="Levels"
                    items={Object.values(LEVEL)}
                    selectedItems={levels}
                    setSelectedItems={(items) => setLevels(items as LEVEL[])}
                />

                <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
                    <Button
                        variant="contained"
                        color="primary"
                        disabled={isDisabled}
                        onClick={() => refetch()}
                    >
                        Fetch logs
                    </Button>
                </Box>
            </Box>

            <Divider sx={{ my: 2 }} />

            <Paper sx={{ height: 600, width: '100%', boxShadow: 3 }}>
                <DataGrid
                    rows={logs}
                    columns={columns}
                    loading={isLoading}
                    onRowClick={(params) => {
                        setSelectedRow(params.row);
                        setModalOpen(true);
                    }}
                    sx={{
                        border: 'none',
                        '& .MuiDataGrid-row:hover': {
                            backgroundColor: 'rgba(0,0,0,0.04)',
                            cursor: 'pointer',
                        },
                        fontSize: 15,
                    }}
                    initialState={{
                        columns: {
                            columnVisibilityModel: {
                                id: false,
                            },
                        },
                    }}
                />
            </Paper>

            <Dialog
                open={modalOpen}
                onClose={() => setModalOpen(false)}
                maxWidth="md"
                fullWidth
            >
                <DialogTitle
                    sx={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                    }}
                >
                    Log Metadata
                    <IconButton onClick={() => setModalOpen(false)}>
                        <FontAwesomeIcon icon={faTimes} />
                    </IconButton>
                </DialogTitle>
                <DialogContent dividers>
                    {selectedRow && (
                        <Box>
                            <Typography variant="subtitle1" sx={{ mb: 1 }}>
                                <Typography component="span" fontWeight={600}>
                                    Message:
                                </Typography>{' '}
                                {selectedRow.message}
                            </Typography>
                            <Typography variant="subtitle2" sx={{ mb: 1 }}>
                                <Typography component="span" fontWeight={600}>
                                    Service:
                                </Typography>{' '}
                                {selectedRow.service} {' | '}
                                <Typography component="span" fontWeight={600}>
                                    Level:
                                </Typography>{' '}
                                {selectedRow.level} {' | '}
                                <Typography component="span" fontWeight={600}>
                                    Date:
                                </Typography>{' '}
                                {selectedRow.date
                                    ? (typeof selectedRow.date === 'string' ||
                                      typeof selectedRow.date === 'number'
                                          ? new Date(selectedRow.date)
                                          : selectedRow.date
                                      ).toLocaleString('fr-BE', {
                                          year: 'numeric',
                                          month: '2-digit',
                                          day: '2-digit',
                                          hour: '2-digit',
                                          minute: '2-digit',
                                          second: '2-digit',
                                      })
                                    : '-'}
                            </Typography>
                            <Typography variant="subtitle2" sx={{ mb: 1 }}>
                                <Typography component="span" fontWeight={600}>
                                    Path:
                                </Typography>{' '}
                                {selectedRow.path} {' | '}
                                <Typography component="span" fontWeight={600}>
                                    Status:
                                </Typography>{' '}
                                {selectedRow.status} {' | '}
                                <Typography component="span" fontWeight={600}>
                                    User ID:
                                </Typography>{' '}
                                {selectedRow.userId}
                            </Typography>
                            <Divider sx={{ my: 2 }} />
                            <Typography variant="subtitle2" sx={{ mb: 1 }}>
                                <Typography component="span" fontWeight={600}>
                                    Metadata:
                                </Typography>
                            </Typography>
                            <Paper
                                sx={{
                                    p: 2,
                                    background: '#222',
                                    color: '#fff',
                                    fontFamily: 'monospace',
                                    fontSize: 14,
                                    overflow: 'auto',
                                }}
                            >
                                <pre style={{ margin: 0 }}>
                                    {JSON.stringify(
                                        selectedRow.metadata,
                                        null,
                                        2
                                    )}
                                </pre>
                            </Paper>
                        </Box>
                    )}
                </DialogContent>
            </Dialog>
        </MaxWidth>
    );
};
