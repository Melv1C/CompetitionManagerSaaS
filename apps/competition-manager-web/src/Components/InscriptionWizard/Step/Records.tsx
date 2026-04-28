import { CircleButton, Icons, StepperButtons } from '@/Components';
import {
    competitionAtom,
    inscriptionDataAtom,
    inscriptionsAtom,
} from '@/GlobalsStates';
import {
    Event,
    Record,
} from '@competition-manager/schemas';
import { formatPerf } from '@competition-manager/utils';
import {
    Box,
    List,
    ListItem,
    ListItemIcon,
    ListItemText,
    Typography,
} from '@mui/material';
import { useAtom, useAtomValue } from 'jotai';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { UpdateRecordPopup } from './UpdateRecordPopup';

type RecordsProps = {
    isAdmin: boolean;
    handleNext: () => void;
    handleBack: () => void;
};

export const Records: React.FC<RecordsProps> = ({ handleNext, handleBack }) => {
    const { t } = useTranslation();

    const competition = useAtomValue(competitionAtom);
    const inscriptions = useAtomValue(inscriptionsAtom);
    if (!competition) throw new Error('Competition not found');
    if (!inscriptions) throw new Error('Inscriptions not found');

    const [{ athlete, inscriptionsData }, setInscriptionData] =
        useAtom(inscriptionDataAtom);
    if (!athlete) throw new Error('Athlete not found');
    if (inscriptionsData.length === 0) throw new Error('No selected events');

    const setNewRecord = (record: Record, event: Event) => {
        const newInscriptionsData = inscriptionsData.map((inscriptionData) => {
            if (inscriptionData.competitionEvent.event.name === event.name) {
                return { ...inscriptionData, record };
            }
            return inscriptionData;
        });
        setInscriptionData((prev) => ({
            ...prev,
            inscriptionsData: newInscriptionsData,
        }));
    };

    const [isPopupOpen, setIsPopupOpen] = useState(false);
    const [eventInPopup, setEventInPopup] = useState<Event | null>(null);
    const [recordInPopup, setRecordInPopup] = useState<Record | null>(null);

    const handleOpenPopup = (record: Record | null, event: Event) => {
        setRecordInPopup(record);
        setEventInPopup(event);
        setIsPopupOpen(true);
    };

    return (
        <Box width={1}>
            <List sx={{ maxWidth: 400, margin: 'auto' }}>
                {inscriptionsData
                    .sort(
                        (a, b) =>
                            a.competitionEvent.schedule.getTime() -
                            b.competitionEvent.schedule.getTime()
                    )
                    .map((inscriptionData) => {
                        const record = inscriptionData.record ?? null;
                        return (
                            <ListItem key={inscriptionData.competitionEvent.id}>
                                <ListItemText
                                    primary={
                                        inscriptionData.competitionEvent.name
                                    }
                                    secondary={
                                        record ? (
                                            <>
                                                <Typography
                                                    component="span"
                                                    variant="body2"
                                                    fontWeight="bold"
                                                >
                                                    {formatPerf(
                                                        record.perf,
                                                        inscriptionData
                                                            .competitionEvent
                                                            .event.type
                                                    )}
                                                </Typography>{' '}
                                                (
                                                {record.date.toLocaleDateString(
                                                    'fr'
                                                )}
                                                )
                                            </>
                                        ) : (
                                            t('competition:noPersonalBest')
                                        )
                                    }
                                />
                                <ListItemIcon>
                                    <CircleButton
                                        onClick={() =>
                                            handleOpenPopup(
                                                record,
                                                inscriptionData.competitionEvent
                                                    .event
                                            )
                                        }
                                    >
                                        <Icons.Edit size="xl" />
                                    </CircleButton>
                                </ListItemIcon>
                            </ListItem>
                        );
                    })}
            </List>

            {isPopupOpen && (
                <UpdateRecordPopup
                    onClose={() => setIsPopupOpen(false)}
                    event={eventInPopup!}
                    record={recordInPopup!}
                    onRecordUpdated={(record) =>
                        setNewRecord(record, eventInPopup!)
                    }
                />
            )}

            <StepperButtons
                buttons={[
                    {
                        label: t('buttons:previous'),
                        onClick: handleBack,
                        variant: 'outlined',
                    },
                    { label: t('buttons:next'), onClick: handleNext },
                ]}
            />
        </Box>
    );
};
