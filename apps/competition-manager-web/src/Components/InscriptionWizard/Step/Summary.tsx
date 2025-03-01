import { createInscriptions, CreateInscriptionsResponseType } from '@/api';
import { Bib, StepperButtons } from '@/Components';
import {
    adminInscriptionsAtom,
    competitionAtom,
    inscriptionDataAtom,
    inscriptionsAtom,
    userInscriptionsAtom,
} from '@/GlobalsStates';
import {
    CreateInscription$,
    PaymentMethod,
} from '@competition-manager/schemas';
import { getCostsInfo } from '@competition-manager/utils';
import {
    Box,
    Card,
    CardContent,
    CardHeader,
    Checkbox,
    Divider,
    FormControlLabel,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableRow,
} from '@mui/material';
import { useAtom, useAtomValue, useSetAtom } from 'jotai';
import { useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { formatPerf } from '../../../utils';

type SummaryProps = {
    isAdmin: boolean;
    handleBack: () => void;
    handleNext: () => void;
};

export const Summary: React.FC<SummaryProps> = ({
    isAdmin,
    handleBack,
    handleNext,
}) => {
    const { t } = useTranslation();

    const competition = useAtomValue(competitionAtom);
    const [userInscriptions, setUserInscriptions] =
        useAtom(userInscriptionsAtom);
    const setInscriptions = useSetAtom(inscriptionsAtom);
    const setAdminInscriptions = useSetAtom(adminInscriptionsAtom);
    if (!competition) throw new Error('Competition not found');
    if (!userInscriptions) throw new Error('User inscriptions not found');

    const { athlete, inscriptionsData } = useAtomValue(inscriptionDataAtom);
    if (!athlete) throw new Error('Athlete not found');
    if (inscriptionsData.length === 0) throw new Error('No selected events');

    const [isAccepted, setIsAccepted] = useState(false);

    const handleConfirm = async () => {
        const createInscriptionData = CreateInscription$.array().parse([
            {
                athleteLicense: athlete.license,
                inscriptions: inscriptionsData.map((inscriptionData) => ({
                    competitionEventEid: inscriptionData.competitionEvent.eid,
                    record: inscriptionData.record,
                })),
            },
        ]);

        const {
            type,
            url,
            inscriptions: newInscriptions,
        } = await createInscriptions(
            competition.eid,
            createInscriptionData,
            isAdmin
        );
        if (type === CreateInscriptionsResponseType.URL) {
            // Redirect to url
            window.location.href = url!;
        } else {
            setInscriptions((prev) => [
                ...prev!.filter(
                    (inscription) =>
                        inscription.athlete.license !== athlete.license
                ),
                ...newInscriptions,
            ]);
            setUserInscriptions((prev) => [
                ...prev!.filter(
                    (inscription) =>
                        inscription.athlete.license !== athlete.license
                ),
                ...newInscriptions,
            ]);
            if (isAdmin)
                setAdminInscriptions((prev) => [
                    ...prev!.filter(
                        (inscription) =>
                            inscription.athlete.license !== athlete.license
                    ),
                    ...newInscriptions,
                ]);
            handleNext();
        }
    };

    const { totalCost, alreadyPaid, fees, totalToPay } = useMemo(
        () =>
            getCostsInfo(
                competition,
                athlete,
                inscriptionsData.map(
                    (inscriptionData) => inscriptionData.competitionEvent.eid
                ),
                userInscriptions
            ),
        [competition, athlete, inscriptionsData, userInscriptions]
    );

    return (
        <Box width={1}>
            <Card
                sx={{
                    width: '100%',
                    mb: 2,
                }}
            >
                <CardHeader
                    avatar={<Bib value={athlete.bib} size="lg" />}
                    title={`${athlete.firstName} ${athlete.lastName}`}
                    slotProps={{
                        title: {
                            variant: 'h5',
                        },
                    }}
                    sx={{
                        textAlign: 'right',
                    }}
                />
                <CardContent>
                    <TableContainer>
                        <Table size="small">
                            <TableBody>
                                {inscriptionsData
                                    .sort(
                                        (a, b) =>
                                            a.competitionEvent.schedule.getTime() -
                                            b.competitionEvent.schedule.getTime()
                                    )
                                    .map((inscriptionData) => {
                                        const record = inscriptionData.record;
                                        const event =
                                            inscriptionData.competitionEvent;
                                        return (
                                            <TableRow
                                                key={event.id}
                                                sx={{
                                                    // hide last border
                                                    '&:last-child td, &:last-child th':
                                                        {
                                                            border: 0,
                                                        },
                                                }}
                                            >
                                                <TableCell
                                                    padding="none"
                                                    width={50}
                                                >
                                                    {event.schedule.toLocaleTimeString(
                                                        'fr',
                                                        {
                                                            hour: '2-digit',
                                                            minute: '2-digit',
                                                        }
                                                    )}
                                                </TableCell>
                                                <TableCell>
                                                    {event.name}
                                                </TableCell>
                                                <TableCell
                                                    padding="none"
                                                    width={75}
                                                    align="right"
                                                >
                                                    {record
                                                        ? formatPerf(
                                                              record.perf,
                                                              event.event.type
                                                          )
                                                        : '-'}
                                                </TableCell>
                                                <TableCell
                                                    padding="none"
                                                    width={50}
                                                    align="right"
                                                >
                                                    {event.cost} €
                                                </TableCell>
                                            </TableRow>
                                        );
                                    })}
                            </TableBody>
                        </Table>
                    </TableContainer>

                    {totalCost > 0 && (
                        <>
                            <Divider sx={{ borderWidth: 1, my: 2 }} />
                            <TableContainer
                                sx={{
                                    display: 'flex',
                                    justifyContent: 'flex-end',
                                }}
                            >
                                <Table
                                    size="small"
                                    sx={{ width: 'fit-content' }}
                                >
                                    <TableBody>
                                        {totalCost !== totalToPay && (
                                            <TableRow>
                                                <TableCell />
                                                <TableCell align="right">{`${totalCost} €`}</TableCell>
                                            </TableRow>
                                        )}
                                        {alreadyPaid > 0 && (
                                            <TableRow>
                                                <TableCell>
                                                    {t(
                                                        'competition:alreadyPaid'
                                                    )}
                                                </TableCell>
                                                <TableCell align="right">{`- ${alreadyPaid} €`}</TableCell>
                                            </TableRow>
                                        )}
                                        {fees > 0 && (
                                            <TableRow>
                                                <TableCell>
                                                    {t('competition:fees')}
                                                </TableCell>
                                                <TableCell align="right">{`${fees} €`}</TableCell>
                                            </TableRow>
                                        )}
                                        <TableRow
                                            sx={{
                                                borderTopWidth:
                                                    totalCost !== totalToPay
                                                        ? 2
                                                        : 0,
                                                borderTopStyle: 'solid',
                                                '& td, & th': {
                                                    border: 0,
                                                },
                                            }}
                                        >
                                            <TableCell>
                                                {t('glossary:total')}
                                            </TableCell>
                                            <TableCell align="right">{`${totalToPay} €`}</TableCell>
                                        </TableRow>
                                        {competition.method ===
                                            PaymentMethod.ONLINE && (
                                            <TableRow
                                                sx={{
                                                    '& td, & th': {
                                                        border: 0,
                                                    },
                                                }}
                                            >
                                                <TableCell
                                                    align="right"
                                                    colSpan={2}
                                                >
                                                    {t(
                                                        'competition:toPayOnline'
                                                    )}
                                                </TableCell>
                                            </TableRow>
                                        )}
                                        {competition.method ===
                                            PaymentMethod.ONPLACE && (
                                            <TableRow
                                                sx={{
                                                    '& td, & th': {
                                                        border: 0,
                                                    },
                                                }}
                                            >
                                                <TableCell
                                                    align="right"
                                                    colSpan={2}
                                                >
                                                    {t(
                                                        'competition:toPayOnPlace'
                                                    )}
                                                </TableCell>
                                            </TableRow>
                                        )}
                                    </TableBody>
                                </Table>
                            </TableContainer>
                        </>
                    )}
                </CardContent>
            </Card>

            {!isAdmin && (
                <FormControlLabel
                    control={
                        <Checkbox
                            checked={isAccepted}
                            onChange={(e) => setIsAccepted(e.target.checked)}
                        />
                    }
                    label={t('competition:acceptTerms')}
                />
            )}

            <StepperButtons
                buttons={[
                    {
                        label: t('buttons:previous'),
                        onClick: handleBack,
                        variant: 'outlined',
                    },
                    {
                        label:
                            !isAdmin &&
                            competition.method === PaymentMethod.ONLINE &&
                            Math.max(0, totalCost - alreadyPaid) > 0
                                ? t('buttons:pay')
                                : t('buttons:confirm'),
                        onClick: handleConfirm,
                        disabled: !isAccepted && !isAdmin,
                    },
                ]}
            />
        </Box>
    );
};
