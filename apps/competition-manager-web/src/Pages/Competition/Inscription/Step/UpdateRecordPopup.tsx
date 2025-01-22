import { Button, Dialog, DialogActions, DialogContent, DialogTitle, TextField } from "@mui/material"
import { useTranslation } from "react-i18next"
import { Date, Event, EventType, Record } from "@competition-manager/schemas"
import { DistanceInput, PointsInput, TimeInput } from "./PerformanceInput"
import { useMemo, useState } from "react"
import { MobileDatePicker } from "@mui/x-date-pickers"

type UpdateRecordPopupProps = {
    onClose: () => void,
    event: Event,
    record: Record,
    onRecordUpdated: (record: Record) => void
}

export const UpdateRecordPopup: React.FC<UpdateRecordPopupProps> = ({ 
    onClose,
    event,
    record,
    onRecordUpdated
}) => {

    const { t } = useTranslation()

    const [perf, setPerf] = useState(record.perf)
    const [date, setDate] = useState<Date | null>(record.date)

    const isEnable = useMemo(() => {
        return perf !== undefined && date !== null && perf !== record.perf
    }, [perf, date, record.perf])

    return (
        <Dialog
            open={true}
            onClose={onClose}
            maxWidth="xs"
            fullWidth
            disableRestoreFocus // prevent the focus to be restored to the button that opened the dialog
        >
            <DialogTitle variant="h5" align="center" id="update-record-title">
                {t('inscription:updatePersonalBest')}
            </DialogTitle>
            <DialogContent sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                {/* readonly TextField for display the event */}
                <TextField
                    label={t('glossary:event')}
                    value={event.name}
                    fullWidth
                    variant="standard"
                    margin="normal"
                    slotProps={{ 
                        input: { 
                            readOnly: true,
                            disableUnderline: true
                        }
                    }}
                />

                {event.type === EventType.TIME ? (
                    <TimeInput
                        value={perf}
                        onChange={(value) => setPerf(value)}
                    />
                ) : (event.type === EventType.DISTANCE || event.type === EventType.HEIGHT) ? (
                    <DistanceInput
                        value={perf}
                        onChange={(value) => setPerf(value)}
                    />
                ) : event.type === EventType.POINTS ? (
                    <PointsInput
                        value={perf}
                        onChange={(value) => setPerf(value)}
                    />
                ) : (
                    <TextField
                        value={perf}
                        fullWidth
                        type="number"
                        onChange={(e) => setPerf(parseFloat(e.target.value))}
                    />
                )}


                <MobileDatePicker
                    label={t('labels:date')}
                    value={date}
                    onChange={(date) => setDate(date)}
                    format="dd/MM/yyyy"
                    slotProps={{ textField: { required: true } }}
                    disableFuture
                />

            </DialogContent>
            <DialogActions>
                <Button onClick={onClose} color="primary">
                    {t('buttons:cancel')}
                </Button>
                <Button 
                    onClick={() => {
                        if (date === null) throw new Error('Unexpected null date')

                        onRecordUpdated({perf, date})
                        onClose()
                    }}
                    color="primary"
                    variant="contained"
                    disabled={!isEnable}
                >
                    {t('buttons:modify')}
                </Button>
            </DialogActions>

        </Dialog>

    )
}
