import { EventType, Result } from '@competition-manager/schemas';
import { faList, faTable } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
    Box,
    Paper,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    ToggleButton,
    ToggleButtonGroup,
} from '@mui/material';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { HeightResultsTable } from './HeightResultsTable';
import { ResultAccordion, ResultRow } from './ResultComponents';
import { ResultDetails } from './ResultDetails';

export const TimeResults = ({ results }: { results: Result[] }) => {
    const { t } = useTranslation();

    return (
        <TableContainer component={Paper}>
            <Table size="small">
                <TableHead>
                    <TableRow>
                        <TableCell>
                            {t('competition:results.position')}
                        </TableCell>
                        <TableCell>{t('competition:results.bib')}</TableCell>
                        <TableCell>
                            {t('competition:results.athlete')}
                        </TableCell>
                        <TableCell>{t('competition:results.club')}</TableCell>
                        <TableCell align="right">
                            {t('competition:results.time')}
                        </TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {results.map((result, index) => (
                        <ResultRow
                            key={result.id}
                            result={result}
                            position={index + 1}
                            eventType={EventType.TIME}
                        />
                    ))}
                </TableBody>
            </Table>
        </TableContainer>
    );
};

export const DistanceResults = ({ results }: { results: Result[] }) => {
    const { t } = useTranslation();

    return (
        <TableContainer component={Paper}>
            <Table size="small">
                <TableHead>
                    <TableRow>
                        <TableCell>
                            {t('competition:results.position')}
                        </TableCell>
                        <TableCell>{t('competition:results.bib')}</TableCell>
                        <TableCell>
                            {t('competition:results.athlete')}
                        </TableCell>
                        <TableCell>{t('competition:results.club')}</TableCell>
                        <TableCell align="right">
                            {t('competition:results.distance')}
                        </TableCell>
                        <TableCell></TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {results.map((result, index) =>
                        result.details && result.details.length > 0 ? (
                            <ResultAccordion
                                key={result.id}
                                result={result}
                                position={index + 1}
                                eventType={EventType.DISTANCE}
                            >
                                <ResultDetails
                                    details={result.details.sort(
                                        (a, b) => a.tryNumber - b.tryNumber
                                    )}
                                    eventType={EventType.DISTANCE}
                                />
                            </ResultAccordion>
                        ) : (
                            <ResultRow
                                key={result.id}
                                result={result}
                                position={index + 1}
                                eventType={EventType.DISTANCE}
                                extraColumns={<TableCell />}
                            />
                        )
                    )}
                </TableBody>
            </Table>
        </TableContainer>
    );
};

export const HeightResults = ({ results }: { results: Result[] }) => {
    const { t } = useTranslation();
    const [displayMode, setDisplayMode] = useState<'list' | 'table'>('list');

    const handleDisplayModeChange = (
        _: React.MouseEvent<HTMLElement>,
        newDisplayMode: 'list' | 'table' | null
    ) => {
        if (newDisplayMode !== null) {
            setDisplayMode(newDisplayMode);
        }
    };

    return (
        <>
            <Box
                sx={{
                    position: 'relative',
                }}
            >
                <ToggleButtonGroup
                    sx={{
                        position: 'absolute',
                        top: -38,
                        right: 0,
                        zIndex: 1,
                    }}
                    value={displayMode}
                    exclusive
                    onChange={handleDisplayModeChange}
                    aria-label="display mode"
                    size="small"
                >
                    <ToggleButton value="list" aria-label="list view">
                        <FontAwesomeIcon icon={faList} />
                    </ToggleButton>
                    <ToggleButton value="table" aria-label="table view">
                        <FontAwesomeIcon icon={faTable} />
                    </ToggleButton>
                </ToggleButtonGroup>
            </Box>

            {displayMode === 'list' ? (
                <TableContainer component={Paper}>
                    <Table size="small">
                        <TableHead>
                            <TableRow>
                                <TableCell>
                                    {t('competition:results.position')}
                                </TableCell>
                                <TableCell>
                                    {t('competition:results.bib')}
                                </TableCell>
                                <TableCell>
                                    {t('competition:results.athlete')}
                                </TableCell>
                                <TableCell>
                                    {t('competition:results.club')}
                                </TableCell>
                                <TableCell align="right">
                                    {t('competition:results.height')}
                                </TableCell>
                                <TableCell></TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {results.map((result, index) =>
                                result.details && result.details.length > 0 ? (
                                    <ResultAccordion
                                        key={result.id}
                                        result={result}
                                        position={index + 1}
                                        eventType={EventType.HEIGHT}
                                    >
                                        <ResultDetails
                                            details={result.details.sort(
                                                (a, b) =>
                                                    a.tryNumber - b.tryNumber
                                            )}
                                            eventType={EventType.HEIGHT}
                                        />
                                    </ResultAccordion>
                                ) : (
                                    <ResultRow
                                        key={result.id}
                                        result={result}
                                        position={index + 1}
                                        eventType={EventType.HEIGHT}
                                        extraColumns={<TableCell />}
                                    />
                                )
                            )}
                        </TableBody>
                    </Table>
                </TableContainer>
            ) : (
                <HeightResultsTable results={results} />
            )}
        </>
    );
};

export const PointsResults = ({ results }: { results: Result[] }) => {
    const { t } = useTranslation();

    return (
        <TableContainer component={Paper}>
            <Table size="small">
                <TableHead>
                    <TableRow>
                        <TableCell>
                            {t('competition:results.position')}
                        </TableCell>
                        <TableCell>{t('competition:results.bib')}</TableCell>
                        <TableCell>
                            {t('competition:results.athlete')}
                        </TableCell>
                        <TableCell>{t('competition:results.club')}</TableCell>
                        <TableCell align="right">
                            {t('competition:results.points')}
                        </TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {results.map((result, index) => (
                        <ResultRow
                            key={result.id}
                            result={result}
                            position={index + 1}
                            eventType={EventType.POINTS}
                        />
                    ))}
                </TableBody>
            </Table>
        </TableContainer>
    );
};

export const GenericResults = ({ results }: { results: Result[] }) => {
    const { t } = useTranslation();

    return (
        <TableContainer component={Paper}>
            <Table size="small">
                <TableHead>
                    <TableRow>
                        <TableCell>
                            {t('competition:results.position')}
                        </TableCell>
                        <TableCell>{t('competition:results.bib')}</TableCell>
                        <TableCell>
                            {t('competition:results.athlete')}
                        </TableCell>
                        <TableCell>{t('competition:results.club')}</TableCell>
                        <TableCell align="right">
                            {t('competition:results.result')}
                        </TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {results.map((result, index) => (
                        <ResultRow
                            key={result.id}
                            result={result}
                            position={index + 1}
                            eventType={EventType.POINTS} // Default to POINTS for generic display
                        />
                    ))}
                </TableBody>
            </Table>
        </TableContainer>
    );
};
