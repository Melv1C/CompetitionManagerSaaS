import { getLogs } from '@/api';
import { MaxWidth } from '@/Components';
import { LEVEL, SERVICE } from '@competition-manager/schemas';
import { Box, Button, Chip, Divider, Paper, Typography } from '@mui/material';
import { DataGrid, GridColDef } from '@mui/x-data-grid';
import { useState } from 'react';
import { useQuery } from 'react-query';
import { Selector } from './Selector';

export const Logs = () => {
    const [services, setServices] = useState<SERVICE[]>(Object.values(SERVICE));
    const [levels, setLevels] = useState<LEVEL[]>(Object.values(LEVEL));

    const isDisabled = services.length === 0 || levels.length === 0;

    const {
        data: logs,
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
            width: 75,
            renderCell: (params) => {
                switch (params.value) {
                    case LEVEL.error:
                        return <Chip label={params.value} color="error" />;
                    case LEVEL.warn:
                        return <Chip label={params.value} color="warning" />;
                    case LEVEL.info:
                        return <Chip label={params.value} color="info" />;
                    case LEVEL.http:
                        return <Chip label={params.value} color="primary" />;
                    default:
                        return <Chip label={params.value} color="secondary" />;
                }
            },
        },
        { field: 'service', headerName: 'Service', width: 100 },
        { field: 'path', headerName: 'Path', width: 150 },
        { field: 'status', headerName: 'Status', width: 75, type: 'number' },
        { field: 'userId', headerName: 'User ID', width: 75, type: 'number' },
        { field: 'message', headerName: 'Message', width: 200 },
        {
            field: 'metadata',
            headerName: 'Metadata',
            width: 200,
            valueFormatter: (value) => JSON.stringify(value, null, 2),
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

            <Box
                component={Paper}
                sx={{
                    height: 600,
                    width: '100%',
                }}
            >
                <DataGrid
                    rows={logs}
                    columns={columns}
                    loading={isLoading}
                    initialState={{
                        columns: {
                            columnVisibilityModel: {
                                id: false,
                            },
                        },
                    }}
                />
            </Box>
        </MaxWidth>
    );
};
