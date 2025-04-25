/**
 * File: apps/competition-manager-web/src/Pages/Admin/Competition/Results/FileTable.tsx
 *
 * Description: Component for displaying competition results in a collapsible table format.
 * Allows viewing detailed information for each result entry.
 */
import { competitionAtom } from '@/GlobalsStates';
import { EventType } from '@competition-manager/schemas';
import { formatResultDetail } from '@competition-manager/utils';
import { faChevronDown, faChevronUp } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
    Box,
    Collapse,
    IconButton,
    Paper,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Typography,
    useTheme,
} from '@mui/material';
import { useAtomValue } from 'jotai';
import { memo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { DisplayResult } from './types';

/**
 * Props for the ResultRow component
 */
type ResultRowProps = {
    row: DisplayResult;
    eventType: EventType;
};

/**
 * Displays a single row of result data with collapsible details
 * Includes enhanced information like athlete name and club
 *
 * @param props - Component properties containing result data and event type
 * @returns React component for a collapsible result row
 */
const Row = memo(function Row({ row, eventType }: ResultRowProps) {
    const [open, setOpen] = useState(false);
    const { t } = useTranslation();
    const theme = useTheme();

    // Format the full name as "LastName, FirstName"
    const fullName = `${row.lastName}, ${row.firstName}`;

    return (
        <>
            <TableRow
                sx={{
                    '& > *': { borderBottom: 'unset' },
                    '&:hover': { backgroundColor: theme.palette.action.hover },
                }}
            >
                <TableCell>
                    <IconButton
                        aria-label="expand row"
                        size="small"
                        onClick={() => setOpen(!open)}
                    >
                        {open ? (
                            <FontAwesomeIcon icon={faChevronUp} />
                        ) : (
                            <FontAwesomeIcon icon={faChevronDown} />
                        )}
                    </IconButton>
                </TableCell>
                <TableCell align="center">{row.finalOrder}</TableCell>
                <TableCell align="center">{row.bib}</TableCell>
                {/* Use formatted full name and club */}
                <TableCell>
                    <Typography variant="body2">
                        {fullName}
                        {row.club && (
                            <Typography
                                component="span"
                                variant="caption"
                                sx={{ ml: 1, color: 'text.secondary' }}
                            >
                                ({row.club})
                            </Typography>
                        )}
                    </Typography>
                </TableCell>
                <TableCell align="center">{row.initialOrder}</TableCell>
                <TableCell align="center">{row.heat}</TableCell>
                <TableCell align="center">
                    {/* Display points if available */}
                    {row.points !== undefined && row.points}
                </TableCell>
            </TableRow>
            <TableRow>
                <TableCell
                    style={{ paddingBottom: 0, paddingTop: 0 }}
                    colSpan={7}
                >
                    <Collapse in={open} timeout="auto" unmountOnExit>
                        <Box sx={{ margin: 1 }}>
                            <Table size="small">
                                <TableHead>
                                    <TableRow>
                                        <TableCell>{t('result:try')}</TableCell>
                                        <TableCell>
                                            {t('result:result')}
                                        </TableCell>
                                        <TableCell>
                                            {t('result:wind')}
                                        </TableCell>
                                        <TableCell>
                                            {t('result:attempts')}
                                        </TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {row.details.map((resultDetail) => (
                                        <TableRow key={resultDetail.tryNumber}>
                                            <TableCell
                                                component="th"
                                                scope="row"
                                            >
                                                {resultDetail.tryNumber}
                                            </TableCell>
                                            <TableCell>
                                                {formatResultDetail(
                                                    resultDetail,
                                                    eventType
                                                )}
                                            </TableCell>
                                            <TableCell>
                                                {resultDetail.wind !== undefined
                                                    ? resultDetail.wind
                                                    : '-'}
                                            </TableCell>
                                            <TableCell>
                                                {resultDetail.attempts?.join(
                                                    ''
                                                ) || '-'}
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </Box>
                    </Collapse>
                </TableCell>
            </TableRow>
        </>
    );
});

/**
 * Props for the FileTable component
 */
type FileTableProps = {
    /** Array of results to display */
    rows: DisplayResult[];
    /** Type of event for formatting values correctly */
    eventType?: EventType;
};

/**
 * Component for displaying competition results in a table with collapsible details
 * Includes enhanced information like athlete name and team
 *
 * @param props - Component properties with result data
 * @returns React component for the file table
 */
export const FileTable: React.FC<FileTableProps> = ({ rows }) => {
    const { t } = useTranslation();

    const competition = useAtomValue(competitionAtom);
    if (!competition) throw new Error('No competition data found');

    // Create a map for faster event type lookups
    const eventTypeMap = new Map(
        competition.events.map((event) => [event.eid, event.event.type])
    );

    return (
        <TableContainer
            component={Paper}
            sx={{
                minHeight: 200,
                margin: 'auto',
                marginTop: 2,
                maxHeight: '60vh',
                overflow: 'auto',
            }}
        >
            <Table aria-label="collapsible table" size="small" stickyHeader>
                <TableHead>
                    <TableRow>
                        <TableCell width={20}></TableCell>
                        <TableCell width={50} align="center">
                            {t('glossary:place')}
                        </TableCell>
                        <TableCell width={50} align="center">
                            {t('glossary:bib')}
                        </TableCell>
                        <TableCell>{t('glossary:athlete')}</TableCell>
                        <TableCell width={50} align="center">
                            {t('result:initialOrder')}
                        </TableCell>
                        <TableCell width={50} align="center">
                            {t('result:heat')}
                        </TableCell>
                        <TableCell width={50} align="center">
                            {t('result:points')}
                        </TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {/* Render actual rows if available */}
                    {rows.map((row) => (
                        <Row
                            key={`${row.athleteLicense}-${row.bib}`}
                            row={row}
                            eventType={
                                eventTypeMap.get(row.competitionEventEid) ||
                                EventType.DISTANCE
                            }
                        />
                    ))}
                </TableBody>
            </Table>
        </TableContainer>
    );
};
