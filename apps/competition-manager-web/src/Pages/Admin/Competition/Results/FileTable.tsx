/**
 * File: apps/competition-manager-web/src/Pages/Admin/Competition/Results/FileTable.tsx
 *
 * Description: Component for displaying competition results in a collapsible table format.
 * Allows viewing detailed information for each result entry.
 */
import { formatPerf } from '@/utils';
import { CreateResult, EventType } from '@competition-manager/schemas';
import { faChevronDown, faChevronUp } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
    Box,
    Collapse,
    IconButton,
    Paper,
    Skeleton,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
} from '@mui/material';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';

/**
 * Props for the ResultRow component
 */
type ResultRowProps = {
    row: CreateResult;
    eventType: EventType;
};

/**
 * Displays a single row of result data with collapsible details
 *
 * @param props - Component properties containing result data and event type
 * @returns React component for a collapsible result row
 */
function Row({ row, eventType }: ResultRowProps) {
    const [open, setOpen] = useState(false);
    const { t } = useTranslation();

    return (
        <>
            <TableRow sx={{ '& > *': { borderBottom: 'unset' } }}>
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
                <TableCell align="center">{row.initialOrder}</TableCell>
                <TableCell align="center">{row.heat}</TableCell>
                <TableCell align="center">{row.athleteLicense}</TableCell>
            </TableRow>
            <TableRow>
                <TableCell
                    style={{ paddingBottom: 0, paddingTop: 0 }}
                    colSpan={6}
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
                                                {/* Convert to millimeters for formatting */}
                                                {formatPerf(
                                                    resultDetail.value * 1000,
                                                    eventType
                                                )}
                                            </TableCell>
                                            <TableCell>
                                                {resultDetail.wind}
                                            </TableCell>
                                            <TableCell>
                                                {resultDetail.attempts}
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
}

/**
 * Props for the FileTable component
 */
type FileTableProps = {
    /** Array of results to display */
    rows: CreateResult[];
    /** Type of event for formatting values correctly */
    eventType?: EventType;
};

/**
 * Component for a placeholder skeleton row when loading or no data
 *
 * @returns React component showing a skeleton row
 */
const SkeletonRow = () => (
    <TableRow>
        <TableCell align="center" width={20}>
            <Skeleton variant="text" animation={false} />
        </TableCell>
        <TableCell align="center" width={50}>
            <Skeleton variant="text" animation={false} />
        </TableCell>
        <TableCell align="center" width={50}>
            <Skeleton variant="text" animation={false} />
        </TableCell>
        <TableCell align="center" width={50}>
            <Skeleton variant="text" animation={false} />
        </TableCell>
        <TableCell align="center" width={50}>
            <Skeleton variant="text" animation={false} />
        </TableCell>
        <TableCell align="center">
            <Skeleton variant="text" animation={false} />
        </TableCell>
    </TableRow>
);

/**
 * Component for displaying competition results in a table with collapsible details
 *
 * @param props - Component properties with result data
 * @returns React component for the file table
 */
export const FileTable: React.FC<FileTableProps> = ({
    rows,
    eventType = EventType.TIME, // Default to TIME event type
}) => {
    const { t } = useTranslation();

    return (
        <TableContainer
            component={Paper}
            sx={{
                minHeight: 200,
                maxWidth: '80%',
                margin: 'auto',
                marginTop: 2,
            }}
        >
            <Table aria-label="collapsible table" size="small">
                <TableHead>
                    <TableRow>
                        <TableCell width={20}></TableCell>
                        <TableCell width={50} align="center">
                            {t('glossary:place')}
                        </TableCell>
                        <TableCell width={50} align="center">
                            {t('glossary:bib')}
                        </TableCell>
                        <TableCell width={50} align="center">
                            {t('result:initialOrder')}
                        </TableCell>
                        <TableCell width={50} align="center">
                            {t('result:heat')}
                        </TableCell>
                        <TableCell align="center">
                            {t('result:license')}
                        </TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {/* Render actual rows if available */}
                    {rows.map((row) => (
                        <Row
                            key={row.athleteLicense}
                            row={row}
                            eventType={eventType}
                        />
                    ))}

                    {/* Show skeleton placeholder rows when no data is available */}
                    {rows.length === 0 && (
                        <>
                            <SkeletonRow />
                            <SkeletonRow />
                            <SkeletonRow />
                            <SkeletonRow />
                        </>
                    )}
                </TableBody>
            </Table>
        </TableContainer>
    );
};
