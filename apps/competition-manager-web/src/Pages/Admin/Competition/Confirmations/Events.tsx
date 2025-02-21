import React from 'react';
import { Accordion, AccordionSummary, AccordionDetails, Table, TableBody, TableCell, TableHead, TableRow, Typography, Avatar, Box, Badge } from '@mui/material';
import { Inscription, InscriptionStatus } from "@competition-manager/schemas";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronDown, faCheck, faQuestion, faXmark } from '@fortawesome/free-solid-svg-icons';
import { ShowUsersNumber } from '../../../../Components';
import { getCategoryAbbr } from '@competition-manager/utils';
import { formatPerf } from '../../../../utils';

type EventsProps = {
    inscriptions: Inscription[];
}

const sortInscriptionStatus = (a: InscriptionStatus, b: InscriptionStatus) => {
    const order = [InscriptionStatus.REMOVED, InscriptionStatus.ACCEPTED, InscriptionStatus.CONFIRMED];
    return order.indexOf(a) - order.indexOf(b);
}

const getStatusIcon = (status: string) => {
    let icon;
    let color;
    switch (status) {
        case InscriptionStatus.CONFIRMED:
            icon = faCheck;
            color = 'success.main';
            break;
        case InscriptionStatus.REMOVED:
            icon = faXmark;
            color = 'error.main';
            break;
        default:
            icon = faQuestion;
            color = undefined;
            break;
    }
    return (
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Avatar sx={{ bgcolor: color, width: 24, height: 24 }}>
                <FontAwesomeIcon icon={icon} color="white" size="xs" />
            </Avatar>
        </Box>
    );
};

const getStatusCounts = (inscriptions: Inscription[]) => {
    return inscriptions.reduce((acc, inscription) => {
        acc[inscription.status] = (acc[inscription.status] || 0) + 1;
        return acc;
    }, {} as Record<string, number>);
};

export const Events: React.FC<EventsProps> = ({ 
    inscriptions 
}) => {
    const groupedInscriptions = inscriptions.reduce((acc, inscription) => {
        const { competitionEvent } = inscription;
        if (!acc[competitionEvent.id]) {
            acc[competitionEvent.id] = {
                event: competitionEvent,
                inscriptions: []
            };
        }
        acc[competitionEvent.id].inscriptions.push(inscription);
        return acc;
    }, {} as Record<string, { event: Inscription['competitionEvent'], inscriptions: Inscription[] }>);

    return (
        <>
            {Object.values(groupedInscriptions).sort((a, b) => a.event.schedule.getTime() - b.event.schedule.getTime()).map(({ event, inscriptions }) => (
                <Accordion key={event.id}>
                    <AccordionSummary expandIcon={<FontAwesomeIcon icon={faChevronDown} />}>
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
                                {event.schedule.toLocaleTimeString('fr', { hour: '2-digit', minute: '2-digit' })}
                            </Avatar>
                        
                            <Typography flexGrow={1} variant="h6">
                                {event.name}
                            </Typography>

                            <Box sx={{ display: 'flex', gap: 2, mr: 2 }}>
                                {Object.entries(getStatusCounts(inscriptions)).sort(([a], [b]) => sortInscriptionStatus(a as InscriptionStatus, b as InscriptionStatus)).map(([status, count]) => {
                                    if (count === 0) return null;
                                    const icon = getStatusIcon(status);
                                    return (
                                        <Badge key={status} badgeContent={count} color="info">
                                            {icon}
                                        </Badge>
                                    );
                                })}
                            </Box>

                            <ShowUsersNumber value={inscriptions.length} />
                        </Box>
                    </AccordionSummary>
                    <AccordionDetails>
                        <Table size="small">
                            <TableHead>
                                <TableRow>
                                    <TableCell align="center">Bib</TableCell>
                                    <TableCell>Name</TableCell>
                                    <TableCell>Category</TableCell>
                                    <TableCell>Club</TableCell>
                                    <TableCell>Record</TableCell>
                                    <TableCell align="center">Status</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {inscriptions.sort((a, b) => sortInscriptionStatus(a.status, b.status)).map((inscription) => (
                                    <TableRow key={inscription.id}>
                                        <TableCell align="center">{inscription.bib}</TableCell>
                                        <TableCell>{`${inscription.athlete.firstName} ${inscription.athlete.lastName}`}</TableCell>
                                        <TableCell>
                                            {getCategoryAbbr(inscription.athlete.birthdate, inscription.athlete.gender, event.schedule)}
                                        </TableCell>
                                        <TableCell>{inscription.club.abbr}</TableCell>
                                        <TableCell>{formatPerf(inscription.record?.perf, inscription.competitionEvent.event.type)}</TableCell>
                                        <TableCell align="center">{getStatusIcon(inscription.status)}</TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </AccordionDetails>
                </Accordion>
            ))}
        </>
    );
};
