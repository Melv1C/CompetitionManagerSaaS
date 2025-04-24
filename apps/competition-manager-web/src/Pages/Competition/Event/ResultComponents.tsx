import { EventType, Result } from '@competition-manager/schemas';
import { formatPerf } from '@competition-manager/utils';
import { faChevronDown } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
    Box,
    Collapse,
    TableCell,
    TableRow,
} from '@mui/material';
import { ReactNode, useState } from 'react';

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
}: ResultRowProps & { children: ReactNode }) => {
    const [open, setOpen] = useState(false);

    const handleToggle = () => {
        setOpen((prev) => !prev);
    };

    return (
        <>
            <TableRow onClick={handleToggle} sx={{ cursor: 'pointer' }}>
                <TableCell>{position}</TableCell>
                <TableCell>{result.bib}</TableCell>
                <TableCell>{`${result.athlete.firstName} ${result.athlete.lastName}`}</TableCell>
                <TableCell>{result.club.abbr}</TableCell>
                <TableCell align="right">
                    {formatPerf(result.value, eventType)}
                </TableCell>
                <TableCell align="right">
                    <FontAwesomeIcon
                        icon={faChevronDown}
                        style={{
                            transform: open ? 'rotate(180deg)' : 'rotate(0deg)',
                            transition: 'transform 0.3s ease',
                        }}
                    />
                </TableCell>
            </TableRow>
            <TableRow>
                <TableCell colSpan={6} sx={{ p: 0, border: 0 }}>
                    <Collapse in={open} timeout="auto" unmountOnExit>
                        <Box style={{ padding: '16px' }}>
                            {children}
                        </Box>
                    </Collapse>
                </TableCell>
            </TableRow>
        </>
    );
}



