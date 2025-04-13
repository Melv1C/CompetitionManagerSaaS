import { CircleButton, Icons, MaxWidth, ShowUsersNumber } from '@/Components';
import { competitionAtom, inscriptionsAtom } from '@/GlobalsStates';
import {
    CompetitionEvent,
    CompetitionEvent$,
} from '@competition-manager/schemas';
import { Box, Divider, Typography } from '@mui/material';
import { DataGrid, GridColDef } from '@mui/x-data-grid';
import { useAtomValue } from 'jotai';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { EventPopup } from './EventPopup';

export const Schedule = () => {
    const { t } = useTranslation();

    const competition = useAtomValue(competitionAtom);
    const inscriptions = useAtomValue(inscriptionsAtom);

    if (!competition) throw new Error('No competition found');
    if (!inscriptions) throw new Error('No inscriptions found');

    const events = [...competition.events.filter((e) => !e.parentId)].sort(
        (a, b) => a.schedule.getTime() - b.schedule.getTime()
    );

    const [isEventPopupVisible, setIsEventPopupVisible] = useState(false);
    const [selectedEvent, setSelectedEvent] = useState<CompetitionEvent>();
    const [selectedChildren, setSelectedChildren] = useState<
        CompetitionEvent[]
    >([]);

    const columns: GridColDef[] = [
        {
            field: 'schedule',
            headerName: t('labels:schedule'),
            width: 100,
            valueFormatter: (value: Date) => {
                if (competition.closeDate) {
                    return (
                        value.toLocaleDateString('fr') +
                        ' ' +
                        value.toLocaleTimeString('fr', {
                            hour: '2-digit',
                            minute: '2-digit',
                        })
                    );
                }
                return value.toLocaleTimeString('fr', {
                    hour: '2-digit',
                    minute: '2-digit',
                });
            },
        },
        { field: 'name', headerName: t('labels:name'), width: 150 },
        {
            field: 'inscriptions',
            headerName: t('glossary:inscriptions'),
            width: 100,
            align: 'center',
            valueGetter: (_, row) => {
                const inscriptionsCount = inscriptions.filter(
                    (i) => i.competitionEvent.id === row.id
                ).length;
                return inscriptionsCount;
            },
            renderCell: (params) => (
                <ShowUsersNumber value={params.value as number} />
            ),
        },
        {
            field: 'place',
            headerName: t('glossary:place'),
            width: 100,
            valueFormatter: (value: CompetitionEvent['place']) => {
                if (!value) return '-';
                return value;
            },
        },
        {
            field: 'cost',
            headerName: t('glossary:price'),
            width: 100,
            valueFormatter: (value: number) => {
                if (value === 0) return t('glossary:free');
                return value + '€';
            },
        },
        {
            field: 'actions',
            headerName: t('labels:actions'),
            width: 150,
            renderCell: (params) => (
                <Box>
                    <CircleButton
                        size="2rem"
                        color="primary"
                        onClick={() => {
                            setSelectedEvent(
                                CompetitionEvent$.parse(params.row)
                            );
                            setSelectedChildren(
                                competition.events.filter(
                                    (e) => e.parentId === params.row.id
                                )
                            );
                            setIsEventPopupVisible(true);
                        }}
                    >
                        <Icons.Edit />
                    </CircleButton>
                    <CircleButton
                        size="2rem"
                        color="error"
                        onClick={() => console.log('delete', params.row.id)}
                    >
                        <Icons.Delete />
                    </CircleButton>
                </Box>
            ),
        },
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
                    setSelectedChildren([]);
                    setIsEventPopupVisible(true);
                }}
            >
                <Icons.Add size="3x" />
            </CircleButton>
            {isEventPopupVisible && (
                <EventPopup
                    isVisible={isEventPopupVisible}
                    onClose={() => setIsEventPopupVisible(false)}
                    initialEvent={selectedEvent}
                    initialChildren={selectedChildren}
                />
            )}

            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                <Typography variant="h5">{competition.name}</Typography>

                <Divider />

                <DataGrid columns={columns} rows={events} />
            </Box>
        </MaxWidth>
    );
};
