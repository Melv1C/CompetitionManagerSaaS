import { EventType } from '@competition-manager/schemas';
import { formatPerf, formatResult } from '@competition-manager/utils';
import {
    Paper,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
} from '@mui/material';
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
                        // Calculate current place (placeholder for now)
                        const currentPlace = 0; // TODO: Implement current place calculation

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
                                    {currentPlace}
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
