import { Box } from "@mui/material"
import { StepperButtons, TextFieldWith$ } from "../../../../../../Components"
import { CompetitionEvent$, CompetitionEvent } from "@competition-manager/schemas"
import { useState } from "react"
import { MobileDateTimePicker, MobileTimePicker } from "@mui/x-date-pickers"
import { useAtomValue } from "jotai"
import { competitionAtom } from "../../../../../../GlobalsStates"

type InfosProps = {
    handleBack: () => void
    handleNext: () => void
    name: CompetitionEvent["name"]
    setName: (name: CompetitionEvent["name"]) => void
    schedule?: CompetitionEvent["schedule"]
    setSchedule: (schedule: CompetitionEvent["schedule"]) => void
}

export const Infos: React.FC<InfosProps> = ({
    handleBack,
    handleNext,
    name,
    setName,
    schedule,
    setSchedule,
}) => {

    const competition = useAtomValue(competitionAtom)

    if (!competition) throw new Error('No competition found');

    const [isNameValid, setIsNameValid] = useState(true)
    const [isScheduleValid, setIsScheduleValid] = useState(true)

    const isValid = isNameValid && name !== '' && isScheduleValid && schedule !== undefined

    return (
        <Box>
            <Box 
                sx={{
                    display: 'flex',
                    flexDirection: 'column',
                    gap: 2,
                }}
            >
                {competition.closeDate ? 
                    <MobileDateTimePicker
                        ampm={false}
                        label="Schedule"
                        value={schedule}
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
                        ampm={false}
                        label="Schedule"
                        value={schedule}
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
                    label={{ value: 'Name' }}
                    value={{ value: name, onChange: setName }}
                    validator={{ Schema$: CompetitionEvent$.shape.name, isValid: isNameValid, setIsValid: setIsNameValid }}
                />

            </Box>

            <StepperButtons
                buttons={[
                    { label: 'Back', onClick: handleBack },
                    { label: 'Next', onClick: handleNext, disabled: !isValid },
                ]}
            />

        </Box>
    )
}
