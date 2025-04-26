import { EventType } from '@competition-manager/schemas';
import {
    formatPerf,
    formatResult,
    sortResult,
} from '@competition-manager/utils';
import {
    Paper,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
} from '@mui/material';
import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { InputResultHeight } from './InputResultHeight';
import { HeightsTableProps } from './types';

export const HeightsTable: React.FC<HeightsTableProps> = ({
    heights,
    results,
    handleInputFocus,
    currentInput,
    handleInputChange,
    isMobileDevice,
    isHeightDisabled,
    onEnterPressed,
}) => {
    const { t } = useTranslation();

    // Use useMemo to avoid recalculations on every render
    const places = useMemo(() => {
        const resultPlaces = new Map();

        // Only calculate places for results that have a valid value
        const validResults = results.filter(
            (result) =>
                result.value !== null &&
                result.value !== undefined
        );

        validResults.forEach((result) => {
            // Count results that are better than the current one
            const betterResults = validResults.filter(
                (other) => sortResult(other, result) < 0
            );

            // Place is 1 + number of better results
            const place = betterResults.length + 1;
            resultPlaces.set(result.id, place);
        });

        return resultPlaces;
    }, [results]); // Only recalculate when results change

    return (
        <TableContainer component={Paper}>
            <Table stickyHeader>
                <TableHead>
                    <TableRow>
                        <TableCell align="center" sx={{ width: '30px' }}>
                            {t('glossary:order')}
                        </TableCell>
                        <TableCell align="center" sx={{ width: '60px' }}>
                            {t('glossary:bib')}
                        </TableCell>
                        <TableCell>{t('glossary:athlete')}</TableCell>
                        <TableCell>{t('glossary:club')}</TableCell>
                        {heights.map((height) => (
                            <TableCell
                                key={`head-${height}`}
                                align="center"
                                sx={{ minWidth: '100px' }}
                            >
                                {formatPerf(height, EventType.HEIGHT)}
                            </TableCell>
                        ))}
                        <TableCell align="center" sx={{ width: '30px' }}>
                            {t('glossary:place')}
                        </TableCell>
                        <TableCell align="center" sx={{ width: '80px' }}>
                            {t('glossary:best')}
                        </TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {results.map((result) => {

                        return (
                            <TableRow key={result.id}>
                                <TableCell
                                    align="center"
                                    sx={{ width: '30px' }}
                                >
                                    {result.initialOrder}
                                </TableCell>
                                <TableCell
                                    align="center"
                                    sx={{ width: '60px' }}
                                >
                                    {result.bib}
                                </TableCell>
                                <TableCell>
                                    {result.athlete.firstName}{' '}
                                    {result.athlete.lastName}
                                </TableCell>
                                <TableCell>{result.club.abbr}</TableCell>

                                {heights.map((height, heightIndex) => (
                                    <TableCell
                                        key={`cell-${result.id}-${height}`}
                                        align="center"
                                    >
                                        <InputResultHeight
                                            resultId={result.id}
                                            height={height}
                                            resultDetail={result.details.find(
                                                (detail) =>
                                                    detail.tryNumber === height
                                            )}
                                            handleInputFocus={handleInputFocus}
                                            currentInput={currentInput}
                                            isDisabled={isHeightDisabled(
                                                result.id,
                                                heightIndex
                                            )}
                                            onInputChange={handleInputChange}
                                            isMobileDevice={isMobileDevice}
                                            onInputBlur={() => {}}
                                            onEnterKeyPress={onEnterPressed}
                                        />
                                    </TableCell>
                                ))}

                                <TableCell
                                    align="center"
                                    sx={{ width: '30px' }}
                                >
                                    {places.get(result.id) ?? '-'}
                                </TableCell>
                                <TableCell
                                    align="center"
                                    sx={{ width: '80px' }}
                                >
                                    {formatResult(result)}
                                </TableCell>
                            </TableRow>
                        );
                    })}
                </TableBody>
            </Table>
        </TableContainer>
    );
};
