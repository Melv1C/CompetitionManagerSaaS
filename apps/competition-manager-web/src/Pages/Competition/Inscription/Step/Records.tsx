import { Box, List, ListItem, ListItemIcon, ListItemText, Typography } from "@mui/material";
import { CircleButton, Edit, Loading, StepperButtons } from "../../../../Components";
import { useTranslation } from "react-i18next";
import { useAtom, useAtomValue } from "jotai";
import { competitionAtom, inscriptionDataAtom } from "../../../../GlobalsStates";
import { useQuery } from "react-query";
import { getRecords } from "../../../../api";
import { formatPerf } from "../../../../utils";
import { Event, Record, Records as RecordsType } from "@competition-manager/schemas";
import { useEffect, useState } from "react";
import { UpdateRecordPopup } from "./UpdateRecordPopup";


type RecordsProps = {
    handleNext: () => void;
    handleBack: () => void;
}

export const Records: React.FC<RecordsProps> = ({
    handleNext,
    handleBack
}) => {

    const { t } = useTranslation();

    const competition = useAtomValue(competitionAtom);
    if (!competition) throw new Error('Competition not found');

    const [{ athlete, selectedEvents, records }, setInscriptionData] = useAtom(inscriptionDataAtom);
    if (!athlete) throw new Error('Athlete not found');
    if (selectedEvents.length === 0) throw new Error('No selected events');

    const setRecords = (records: RecordsType) => setInscriptionData((prev) => ({ ...prev, records }));

    const [isPopupOpen, setIsPopupOpen] = useState(false);
    const [eventInPopup, setEventInPopup] = useState<Event | null>(null);
    const [recordInPopup, setRecordInPopup] = useState<Record | null>(null);

    const handleOpenPopup = (record: Record | null, event: Event) => {
        setRecordInPopup(record);
        setEventInPopup(event);
        setIsPopupOpen(true);
    }

    const { data: fetchrecords, isLoading, isError } = useQuery(['records', athlete.license, selectedEvents.map((e) => e.event.name)], 
        () => getRecords(athlete.license, selectedEvents.map((e) => e.event.name)),
        { enabled: !records }
    );

    if (isError) throw new Error('Error while fetching records');

    useEffect(() => {
        if (!records && fetchrecords) {
            setRecords(fetchrecords);
        }
    }, [records, fetchrecords]);

    if (isLoading || !records) return <Loading />

    return (
        <Box width={1}>
            <List>
                {selectedEvents.sort((a, b) => a.schedule.getTime() - b.schedule.getTime()).map((selectedEvent) => {
                    const record = records[selectedEvent.event.name]
                    return (
                        <ListItem key={selectedEvent.id}>
                            <ListItemText
                                primary={selectedEvent.name}
                                secondary={record ? (
                                    <>
                                        <Typography component="span" variant="body2" fontWeight="bold">
                                            {formatPerf(record.perf, selectedEvent.event.type)}
                                        </Typography>
                                        {' '}
                                        ({record.date.toLocaleDateString()})
                                    </>
                                ) : t('inscription:noPersonalBest')}
                            />
                            <ListItemIcon>
                                <CircleButton onClick={() => handleOpenPopup(record, selectedEvent.event)}>
                                    <Edit size="xl"/>   
                                </CircleButton>
                            </ListItemIcon>
                        </ListItem>
                    )
                })}
            </List>

            {isPopupOpen && 
                <UpdateRecordPopup 
                    onClose={() => setIsPopupOpen(false)} 
                    event={eventInPopup!} 
                    record={recordInPopup!} 
                    onRecordUpdated={(record) => setRecords({ ...records, [eventInPopup!.name]: record })} 
                />
            }

            <StepperButtons 
                buttons={[
                    { label: t('buttons:previous'), onClick: handleBack, variant: 'outlined' },
                    { label: t('buttons:next'), onClick: handleNext }
                ]}
            />
        </Box>
    )
}
