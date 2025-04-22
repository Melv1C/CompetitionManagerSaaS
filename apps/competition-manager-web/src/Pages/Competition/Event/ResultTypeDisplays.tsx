import { EventType, Result } from '@competition-manager/schemas';
import {
    Paper,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
} from '@mui/material';
import { ResultAccordion, ResultRow } from './ResultComponents';
import { ResultDetails } from './ResultDetails';

export const TimeResults = ({ results }: { results: Result[] }) => (
    <TableContainer component={Paper}>
        <Table size="small">
            <TableHead>
                <TableRow>
                    <TableCell>Pos</TableCell>
                    <TableCell>Bib</TableCell>
                    <TableCell>Athlete</TableCell>
                    <TableCell>Club</TableCell>
                    <TableCell align="right">Time</TableCell>
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

export const DistanceResults = ({ results }: { results: Result[] }) => (
    <TableContainer component={Paper}>
        <Table size="small">
            <TableHead>
                <TableRow>
                    <TableCell>Pos</TableCell>
                    <TableCell>Bib</TableCell>
                    <TableCell>Athlete</TableCell>
                    <TableCell>Club</TableCell>
                    <TableCell align="right">Distance</TableCell>
                    <TableCell></TableCell>
                </TableRow>
            </TableHead>
            <TableBody>
                {results.map((result, index) => (
                    <ResultAccordion
                        key={result.id}
                        result={result}
                        position={index + 1}
                        eventType={EventType.DISTANCE}
                    >
                        <ResultDetails
                            details={result.details.sort((a, b) => a.tryNumber - b.tryNumber)}
                            eventType={EventType.DISTANCE}
                        />
                    </ResultAccordion>
                ))}
            </TableBody>
        </Table>
    </TableContainer>
);

export const HeightResults = ({ results }: { results: Result[] }) => (
    <TableContainer component={Paper}>
        <Table size="small">
            <TableHead>
                <TableRow>
                    <TableCell>Pos</TableCell>
                    <TableCell>Bib</TableCell>
                    <TableCell>Athlete</TableCell>
                    <TableCell>Club</TableCell>
                    <TableCell align="right">Height</TableCell>
                </TableRow>
            </TableHead>
            <TableBody>
                {results.map((result, index) => (
                    <TableRow key={result.id}>
                        <TableCell colSpan={5} sx={{ p: 0, border: 0 }}>
                            <ResultAccordion
                                key={result.id}
                                result={result}
                                position={index + 1}
                                eventType={EventType.HEIGHT}
                            >
                                <ResultDetails
                                    details={result.details.sort((a, b) => a.tryNumber - b.tryNumber)}
                                    eventType={EventType.HEIGHT}
                                />
                            </ResultAccordion>
                        </TableCell>
                    </TableRow>
                ))}
            </TableBody>
        </Table>
    </TableContainer>
);

export const PointsResults = ({ results }: { results: Result[] }) => (
    <TableContainer component={Paper}>
        <Table size="small">
            <TableHead>
                <TableRow>
                    <TableCell>Pos</TableCell>
                    <TableCell>Bib</TableCell>
                    <TableCell>Athlete</TableCell>
                    <TableCell>Club</TableCell>
                    <TableCell align="right">Points</TableCell>
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

export const GenericResults = ({ results }: { results: Result[] }) => (
    <TableContainer component={Paper}>
        <Table size="small">
            <TableHead>
                <TableRow>
                    <TableCell>Pos</TableCell>
                    <TableCell>Bib</TableCell>
                    <TableCell>Athlete</TableCell>
                    <TableCell>Club</TableCell>
                    <TableCell align="right">Result</TableCell>
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
