import { Inscription } from '@competition-manager/schemas';
import { getCategoryAbbr } from '@competition-manager/utils';
import { faChevronDown } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
    Accordion,
    AccordionDetails,
    AccordionSummary,
    Avatar,
    Box,
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableRow,
    Typography,
} from '@mui/material';
import React from 'react';
import { ShowUsersNumber } from '../../../../Components';
import { formatPerf } from '../../../../utils';

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
        <div>
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

                                <ShowUsersNumber value={inscriptions.length} />
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
                                                {inscription.status}
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </AccordionDetails>
                    </Accordion>
                ))}
        </div>
    );
};
