import { formatPerf } from '@/utils/formatPerf';
import { EventType, Result } from '@competition-manager/schemas';
import { faChevronDown } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
    Accordion,
    AccordionDetails,
    AccordionSummary,
    Box,
    TableCell,
    TableRow,
    Typography,
} from '@mui/material';
import { ReactNode } from 'react';

export interface ResultRowProps {
    result: Result;
    position: number;
    eventType: EventType;
    extraColumns?: ReactNode;
}

export const ResultRow = ({
    result,
    position,
    eventType,
    extraColumns,
}: ResultRowProps) => (
    <TableRow>
        <TableCell>{position}</TableCell>
        <TableCell>{result.bib}</TableCell>
        <TableCell>{`${result.athlete.firstName} ${result.athlete.lastName}`}</TableCell>
        <TableCell>{result.club.abbr}</TableCell>
        <TableCell align="right">
            {formatPerf(result.value, eventType)}
        </TableCell>
        {extraColumns}
    </TableRow>
);

export const ResultAccordion = ({
    result,
    position,
    eventType,
    children,
}: ResultRowProps & { children: ReactNode }) => (
    <Accordion>
        <AccordionSummary
            expandIcon={<FontAwesomeIcon icon={faChevronDown} />}
            sx={{ '& .MuiAccordionSummary-content': { margin: 0 } }}
        >
            <Box sx={{ display: 'flex', width: '100%', alignItems: 'center' }}>
                <Typography sx={{ width: '5%', flexShrink: 0 }}>
                    {position}
                </Typography>
                <Typography sx={{ width: '10%', flexShrink: 0 }}>
                    {result.bib}
                </Typography>
                <Typography sx={{ width: '35%', flexShrink: 0 }}>
                    {`${result.athlete.firstName} ${result.athlete.lastName}`}
                </Typography>
                <Typography sx={{ width: '30%', flexShrink: 0 }}>
                    {result.club.name}
                </Typography>
                <Typography sx={{ flexGrow: 1, textAlign: 'right' }}>
                    {formatPerf(result.value, eventType)}
                </Typography>
                {result.wind !== null && (
                    <Typography sx={{ width: '15%', textAlign: 'right' }}>
                        {`${(result.wind ?? 0).toFixed(1)} m/s`}
                    </Typography>
                )}
            </Box>
        </AccordionSummary>
        <AccordionDetails>{children}</AccordionDetails>
    </Accordion>
);
