import { Box } from "@mui/material"
import { StepperButtons, TextFieldWith$ } from "../../../../../../Components"
import { CompetitionEvent$, CompetitionEvent } from "@competition-manager/schemas"
import { useState } from "react"
import { MobileDateTimePicker, MobileTimePicker } from "@mui/x-date-pickers"
import { useAtom, useAtomValue } from "jotai"
import { competitionAtom, competitionEventDataAtom } from "../../../../../../GlobalsStates"
import { useTranslation } from "react-i18next"

type InfosProps = {
    handleBack: () => void
    handleNext: () => void
}

export const Infos: React.FC<InfosProps> = ({
    handleBack,
    handleNext,
}) => {

    const { t } = useTranslation('eventPopup');

    const competition = useAtomValue(competitionAtom)

    if (!competition) throw new Error('No competition found');

    const [competitionEventData, setCompetitionEventData] = useAtom(competitionEventDataAtom);

    const setName = (name: CompetitionEvent["name"]) => {
        setCompetitionEventData((prev) => ({
            ...prev,
            name,
        }))
    }

    const setSchedule = (date: CompetitionEvent["schedule"]) => {
        setCompetitionEventData((prev) => ({
            ...prev,
            schedule: date,
        }))
    }

    const [isNameValid, setIsNameValid] = useState(true)
    const [isScheduleValid, setIsScheduleValid] = useState(true)

    const [isChildrenNameValid, setIsChildrenNameValid] = useState(competitionEventData.children.map(() => true))
    const [isChildrenScheduleValid, setIsChildrenScheduleValid] = useState(competitionEventData.children.map(() => true))

    const isValid = isNameValid && competitionEventData.name !== '' 
        && isScheduleValid && competitionEventData.schedule !== undefined 
        && isChildrenNameValid.every((valid) => valid) && isChildrenScheduleValid.every((valid) => valid)
        && competitionEventData.children.every((child) => child.name !== '' && child.schedule !== undefined)

    return (
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            <Box 
                sx={{
                    display: 'flex',
                    flexDirection: 'row',
                    gap: 2,
                }}
            >
                {competition.closeDate ? 
                    <MobileDateTimePicker
                        sx={{ width: '200px' }}
                        ampm={false}
                        label={t('labels:schedule')}
                        value={competitionEventData.schedule}
                        onChange={(date) => {
                            if (!date) {
                                setIsScheduleValid(false);
                                return;
                            }
                            setSchedule(date);
                        }}
                        onError={(error) => setIsScheduleValid(!error)}
                        format="dd/MM/yyyy HH:mm"
                        minDate={competition.date}
                        maxDate={competition.closeDate}
                    />
                :
                    <MobileTimePicker
                        sx={{ width: '100px' }}
                        ampm={false}
                        label={t('labels:schedule')}
                        value={competitionEventData.schedule}
                        onChange={(date) => {
                            if (!date) {
                                setIsScheduleValid(false);
                                return;
                            }
                            setSchedule(date);
                        }}
                        onError={(error) => {
                            console.log(error)
                            setIsScheduleValid(!error)
                        }}
                        format="HH:mm"
                        referenceDate={competition.date}
                    />
                }

                <TextFieldWith$
                    id="name"
                    label={{ value: t('labels:name') }}
                    value={{ value: competitionEventData.name, onChange: setName }}
                    validator={{ Schema$: CompetitionEvent$.shape.name, isValid: isNameValid, setIsValid: setIsNameValid }}
                    formControlProps={{ sx: { flexGrow: 1 } }}
                />
            </Box>

            {competitionEventData.children.map((child, index) => (
                <Box 
                    key={index}
                    sx={{
                        display: 'flex',
                        flexDirection: 'row',
                        gap: 2,
                    }}
                >
                    {competition.closeDate ? 
                        <MobileDateTimePicker
                            sx={{ width: '200px' }}
                            ampm={false}
                            label={`${t('labels:schedule')} (${t('subEvent')} ${index + 1})`}
                            value={child.schedule}
                            onChange={(date) => {
                                if (!date) {
                                    setIsChildrenScheduleValid((prev) => prev.map((_, i) => i === index ? false : _));
                                    return;
                                }
                                setCompetitionEventData((prev) => ({
                                    ...prev,
                                    children: prev.children.map((child, i) => i === index ? { ...child, schedule: date } : child)
                                }))
                            }}
                            onError={(error) => setIsChildrenScheduleValid((prev) => prev.map((_, i) => i === index ? !error : _))}
                            format="dd/MM/yyyy HH:mm"
                            minDate={competition.date}
                            maxDate={competition.closeDate}
                        />
                    :
                        <MobileTimePicker
                            sx={{ width: '100px' }}
                            ampm={false}
                            label={`${t('labels:schedule')} (${t('subEvent')} ${index + 1})`}
                            value={child.schedule}
                            onChange={(date) => {
                                if (!date) {
                                    setIsChildrenScheduleValid((prev) => prev.map((_, i) => i === index ? false : _));
                                    return;
                                }
                                setCompetitionEventData((prev) => ({
                                    ...prev,
                                    children: prev.children.map((child, i) => i === index ? { ...child, schedule: date } : child)
                                }))
                            }}
                            onError={(error) => setIsChildrenScheduleValid((prev) => prev.map((_, i) => i === index ? !error : _))}
                            format="HH:mm"
                            referenceDate={competition.date}
                        />
                    }

                    <TextFieldWith$
                        id={`name-${index}`}
                        label={{ value: `${t('labels:name')} (${t('subEvent')} ${index + 1})` }}
                        value={{ value: child.name, onChange: (name) => {
                            setCompetitionEventData((prev) => ({
                                ...prev,
                                children: prev.children.map((child, i) => i === index ? { ...child, name } : child)
                            }))
                        }}}
                        validator={{ Schema$: CompetitionEvent$.shape.name, isValid: isChildrenNameValid[index], setIsValid: (value) => setIsChildrenNameValid((prev) => prev.map((_, i) => i === index ? value : _)) }}
                        formControlProps={{ sx: { flexGrow: 1 } }}
                    />
                </Box>
            ))}


            <StepperButtons
                buttons={[
                    { label: t('buttons:previous'), onClick: handleBack, variant: 'outlined' },
                    { label: t('buttons:next'), onClick: handleNext, disabled: !isValid },
                ]}
            />

        </Box>
    )
}
