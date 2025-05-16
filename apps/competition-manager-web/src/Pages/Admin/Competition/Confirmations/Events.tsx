import { Inscription, InscriptionStatus } from '@competition-manager/schemas';
import { formatPerf, getCategoryAbbr } from '@competition-manager/utils';
import { faChevronDown } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
    Accordion,
    AccordionDetails,
    AccordionSummary,
    Avatar,
    Box,
    Chip,
    Stack,
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableRow,
    Tooltip,
    Typography,
} from '@mui/material';
import React from 'react';

// Component to display status counts
const StatusCounts: React.FC<{ inscriptions: Inscription[] }> = ({
    inscriptions,
}) => {
    const counts = inscriptions.reduce((acc, inscription) => {
        acc[inscription.status] = (acc[inscription.status] || 0) + 1;
        return acc;
    }, {} as Record<string, number>);

    return (
        <Stack direction="row" spacing={1}>
            {Object.entries(counts).map(([status, count]) => {
                let color: 'success' | 'warning' | 'error' | 'default' =
                    'default';

                switch (status) {
                    case InscriptionStatus.CONFIRMED:
                        color = 'success';
                        break;
                    case InscriptionStatus.ACCEPTED:
                        color = 'warning';
                        break;
                    case InscriptionStatus.REMOVED:
                        color = 'error';
                        break;
                }

                return (
                    <Tooltip key={status} title={status}>
                        <Chip
                            size="small"
                            color={color}
                            label={count}
                            sx={{ fontWeight: 'bold' }}
                        />
                    </Tooltip>
                );
            })}
        </Stack>
    );
};

// Component for status display in table cell
const StatusChip: React.FC<{ status: string }> = ({ status }) => {
    let color: 'success' | 'warning' | 'error' | 'default' = 'default';

    switch (status) {
        case InscriptionStatus.CONFIRMED:
            color = 'success';
            break;
        case InscriptionStatus.ACCEPTED:
            color = 'warning';
            break;
        case InscriptionStatus.REMOVED:
            color = 'error';
            break;
    }

    return <Chip size="small" color={color} label={status} />;
};

type EventsProps = {
    inscriptions: Inscription[];
};

export const Events: React.FC<EventsProps> = ({ inscriptions }) => {
    const groupedInscriptions = inscriptions.reduce((acc, inscription) => {
        const { competitionEvent } = inscription;
        if (!acc[competitionEvent.id]) {
            acc[competitionEvent.id] = {
                event: competitionEvent,
                inscriptions: [],
            };
        }
        acc[competitionEvent.id].inscriptions.push(inscription);
        return acc;
    }, {} as Record<string, { event: Inscription['competitionEvent']; inscriptions: Inscription[] }>);

    return (
        <Box>
            {Object.values(groupedInscriptions)
                .sort(
                    (a, b) =>
                        a.event.schedule.getTime() - b.event.schedule.getTime()
                )
                .map(({ event, inscriptions }) => (
                    <Accordion key={event.id}>
                        <AccordionSummary
                            expandIcon={
                                <FontAwesomeIcon icon={faChevronDown} />
                            }
                        >
                            <Box
                                sx={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: 2,
                                    width: '100%',
                                    pr: 2,
                                }}
                            >
                                <Avatar
                                    sx={{
                                        bgcolor: 'primary.main',
                                        color: 'primary.contrastText',
                                        width: 40,
                                        height: 40,
                                        fontWeight: 'bold',
                                        fontSize: '0.75rem',
                                    }}
                                >
                                    {event.schedule.toLocaleTimeString('fr', {
                                        hour: '2-digit',
                                        minute: '2-digit',
                                    })}
                                </Avatar>

                                <Typography flexGrow={1} variant="h6">
                                    {event.name}
                                </Typography>

                                <StatusCounts inscriptions={inscriptions} />
                            </Box>
                        </AccordionSummary>
                        <AccordionDetails>
                            <Table size="small">
                                <TableHead>
                                    <TableRow>
                                        <TableCell align="center">
                                            Bib
                                        </TableCell>
                                        <TableCell>Name</TableCell>
                                        <TableCell>Category</TableCell>
                                        <TableCell>Club</TableCell>
                                        <TableCell>Record</TableCell>
                                        <TableCell>Status</TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {inscriptions.map((inscription) => (
                                        <TableRow key={inscription.id}>
                                            <TableCell align="center">
                                                {inscription.bib}
                                            </TableCell>
                                            <TableCell>{`${inscription.athlete.firstName} ${inscription.athlete.lastName}`}</TableCell>
                                            <TableCell>
                                                {getCategoryAbbr(
                                                    inscription.athlete
                                                        .birthdate,
                                                    inscription.athlete.gender,
                                                    event.schedule
                                                )}
                                            </TableCell>
                                            <TableCell>
                                                {inscription.club.abbr}
                                            </TableCell>
                                            <TableCell>
                                                {formatPerf(
                                                    inscription.record?.perf,
                                                    inscription.competitionEvent
                                                        .event.type
                                                )}
                                            </TableCell>
                                            <TableCell>
                                                <StatusChip
                                                    status={inscription.status}
                                                />
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </AccordionDetails>
                    </Accordion>
                ))}
        </Box>
    );
};
