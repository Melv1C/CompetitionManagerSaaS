import { useAtomValue } from "jotai";
import { useTranslation } from "react-i18next";
import { competitionAtom, inscriptionDataAtom } from "../../../../GlobalsStates";
import { Box, Card, CardContent, CardHeader, Checkbox, FormControlLabel, Table, TableBody, TableCell, TableContainer, TableRow, Typography } from "@mui/material";
import { Bib, StepperButtons } from "../../../../Components";
import { formatPerf } from "../../../../utils";
import { useState } from "react";
import { CreateInscription$ } from "@competition-manager/schemas";
import { createInscriptions } from "../../../../api";

type SummaryProps = {
    handleBack: () => void;
}

export const Summary: React.FC<SummaryProps> = ({
    handleBack
}) => {
    const { t } = useTranslation();
    
    const competition = useAtomValue(competitionAtom);
    if (!competition) throw new Error('Competition not found');

    const { athlete, selectedEvents, records } = useAtomValue(inscriptionDataAtom);
    if (!athlete) throw new Error('Athlete not found');
    if (selectedEvents.length === 0) throw new Error('No selected events');

    const totalCost = selectedEvents.reduce((acc, event) => acc + event.cost, 0);

    const [isAccepted, setIsAccepted] = useState(false);

    const handleConfirm = async () => {
        const createInscriptionData = CreateInscription$.array().parse(selectedEvents.map(event => ({
            competitionEventEid: event.eid,
            athleteLicense: athlete.license,
            record: records?.[event.event.name]
        })));

        const data = await createInscriptions(competition.eid, createInscriptionData);
        console.log(data);
        // TODO: Handle response: redirect to url ?
    }

    return (
        <Box width={1}>
            <Typography variant="h4" sx={{ mb: 2 }}>
                {t('glossary:summary')}
            </Typography>

            <Card
                sx={{ 
                    width: '100%',
                    mb: 2
                }}
            >
                <CardHeader 
                    avatar={<Bib value={athlete.bib} size="lg" />}
                    title={`${athlete.firstName} ${athlete.lastName}`}
                    titleTypographyProps={{ variant: 'h5' }}
                    sx={{ 
                        textAlign: 'right',
                    }}
                />
                <CardContent>
                    <TableContainer>
                        <Table
                            size="small"
                        >
                            <TableBody>
                                {selectedEvents.sort((a, b) => a.schedule.getTime() - b.schedule.getTime()).map(event => {
                                    const record = records?.[event.event.name];
                                    return (
                                        <TableRow key={event.id}>
                                            <TableCell padding="none" width={50}>{event.schedule.toLocaleTimeString('fr', { hour: '2-digit', minute: '2-digit' })}</TableCell>
                                            <TableCell>
                                                {event.name}
                                            </TableCell>
                                            <TableCell padding="none" width={75} align="center">{record ? formatPerf(record.perf, event.event.type) : '-'}</TableCell>
                                            <TableCell padding="none" width={50} align="right">{event.cost} €</TableCell>
                                        </TableRow>
                                    )
                                })}
                                <TableRow 
                                    sx={{
                                        borderTop: 2, 
                                        borderColor: 'divider',
                                        '&:last-child th, &:last-child td': { border: 0 },
                                    }}
                                >
                                    <TableCell rowSpan={2} colSpan={2} size="medium" />
                                    <TableCell padding="none" width={75} align="right">{t('glossary:total')}</TableCell>
                                    <TableCell padding="none" width={50} align="right">{totalCost} €</TableCell>
                                </TableRow>
                                
                            </TableBody>
                        </Table>
                    </TableContainer>
                </CardContent>
            </Card>

            <FormControlLabel control={<Checkbox checked={isAccepted} onChange={(e) => setIsAccepted(e.target.checked)} />} label={t('inscription:acceptTerms')} />

            <StepperButtons
                buttons={[
                    { label: t('buttons:previous'), onClick: handleBack, variant: 'outlined' },
                    { label: t('buttons:confirm'), onClick: handleConfirm, disabled: !isAccepted }
                ]}
            />
        </Box>
    )
}
