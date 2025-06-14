import { Icons, MaxWidth } from '@/Components';
import { useCompetition, useFetchCompetitionData } from '@/hooks';
import { Alert, Box, Divider, IconButton, Typography } from '@mui/material';
import { useAtomValue } from 'jotai';
import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import {
    adminInscriptionsAtom,
    competitionAtom,
} from '../../../../GlobalsStates';
import { Confirmation } from './Confirmation';
import { Events } from './Events';

export const Confirmations = () => {
    const { t } = useTranslation();

    const competition = useAtomValue(competitionAtom);
    const adminInscriptions = useAtomValue(adminInscriptionsAtom);
    if (!competition) throw new Error('No competition found');
    if (!adminInscriptions) throw new Error('No inscriptions found');

    const inscriptions = useMemo(
        () => adminInscriptions.filter((inscription) => !inscription.isDeleted),
        [adminInscriptions]
    );

    const { refresh } = useFetchCompetitionData(competition.eid, true);

    const { isCurrent } = useCompetition();

    return (
        <MaxWidth
            sx={{
                display: 'flex',
                flexDirection: 'column',
                gap: 2,
            }}
        >
            <Box
                sx={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                }}
            >
                <Typography variant="h5">{competition.name}</Typography>

                <IconButton
                    onClick={refresh}
                    color="primary"
                    sx={{
                        '&:hover': {
                            transform: 'rotate(360deg)',
                            transition: 'transform 0.5s ease',
                        },
                        '&:not(:hover)': {
                            transform: 'rotate(0deg)',
                            transition: 'transform 0.5s ease',
                        },
                    }}
                >
                    <Icons.Refresh />
                </IconButton>
            </Box>

            <Divider />

            {!isCurrent && (
                <Alert severity="warning">
                    {t('adminCompetition:competitionNotCurrent')}
                </Alert>
            )}

            {/* Confirmation Zone */}
            <Confirmation
                inscriptions={inscriptions}
                competitionDate={competition.date}
                competitionEid={competition.eid}
            />

            <Divider />

            {/* Event expand list */}
            <Events inscriptions={inscriptions} />
        </MaxWidth>
    );
};
