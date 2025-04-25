import { EventType, Result } from '@competition-manager/schemas';
import { formatResult } from '@competition-manager/utils';
import { faChevronDown } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Box, Collapse, TableCell, TableRow } from '@mui/material';
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
    extraColumns,
}: ResultRowProps) => (
    <TableRow>
        <TableCell>{position}</TableCell>
        <TableCell>{result.bib}</TableCell>
        <TableCell>{`${result.athlete.firstName} ${result.athlete.lastName}`}</TableCell>
        <TableCell>{result.club.abbr}</TableCell>
        <TableCell align="right">{formatResult(result)}</TableCell>
        {extraColumns}
    </TableRow>
);

export const ResultAccordion = ({
    result,
    position,
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
                <TableCell align="right">{formatResult(result)}</TableCell>
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
                        <Box style={{ padding: '16px' }}>{children}</Box>
                    </Collapse>
                </TableCell>
            </TableRow>
        </>
    );
};
