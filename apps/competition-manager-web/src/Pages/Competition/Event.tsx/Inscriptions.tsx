import { DisplayInscription } from '@competition-manager/schemas'
import { getCategoryAbbr, isBestResult } from '@competition-manager/utils'
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Typography } from '@mui/material'
import { useAtomValue } from 'jotai'
import React from 'react'
import { useTranslation } from 'react-i18next'
import { competitionAtom } from '../../../GlobalsStates'
import { formatPerf } from '../../../utils'

type InscriptionsProps = {
    inscriptions: DisplayInscription[]
}

export const Inscriptions: React.FC<InscriptionsProps> = ({ inscriptions }) => {

    const { t } = useTranslation();

    const competition = useAtomValue(competitionAtom);
    if (!competition) throw new Error('No competition found');

    return (
        <>
            <Typography 
                variant="h6"
                sx={{
                    marginBottom: 2,
                    marginLeft: 1,
                }}
            >
                {t('glossary:participants')}
            </Typography>
            <TableContainer>
                <Table size="small">
                    <TableHead sx={{ backgroundColor: 'rgba(0, 0, 0, 0.04)' }}>
                        <TableRow>
                            <TableCell width={50} align="center">
                                {t('glossary:bib')}
                            </TableCell>
                            <TableCell sx={{ minWidth: 150 }}>
                                {t('glossary:athlete')}
                            </TableCell>
                            <TableCell width={100} sx={{ minWidth: 100 }}>
                                {t('glossary:category')}
                            </TableCell>
                            <TableCell width={75} sx={{ minWidth: 75 }}>
                                {t('glossary:club')}
                            </TableCell>
                            <TableCell width={75} sx={{ minWidth: 75 }} align="right">
                                {t('glossary:personalBest')}
                            </TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {inscriptions.length === 0 && (
                            <TableRow>
                                <TableCell colSpan={5} align="center">{t('glossary:noInscriptions')}</TableCell>
                            </TableRow>
                        )}

                        {inscriptions.sort((a, b) => {
                            if (a.record && b.record) {
                                return isBestResult(a.record.perf, b.record.perf, a.competitionEvent.event.type) ? -1 : 1;
                            }
                            if (a.record) return -1;
                            if (b.record) return 1;
                            return 0;
                        }).map(inscription => (
                            <TableRow key={inscription.eid}>
                                <TableCell align="center">{inscription.bib}</TableCell>
                                <TableCell>{inscription.athlete.firstName} {inscription.athlete.lastName}</TableCell>
                                <TableCell>
                                    {getCategoryAbbr(inscription.athlete.birthdate, inscription.athlete.gender, competition.date)}
                                </TableCell>
                                <TableCell>{inscription.club.abbr}</TableCell>
                                <TableCell align="right">{inscription.record ? formatPerf(inscription.record.perf, inscription.competitionEvent.event.type) : '-'}</TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>
        </>
    )
}
