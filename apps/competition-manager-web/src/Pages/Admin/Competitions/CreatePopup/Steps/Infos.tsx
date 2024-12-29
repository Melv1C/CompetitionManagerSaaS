import { Box, FormControl, FormLabel, Switch } from "@mui/material"
import { DatePicker } from '@mui/x-date-pickers';
import { StepProps } from ".."
import { useState } from "react";
import { TextFieldWith$ } from "../../../../../Components/FieldsWithSchema";
import { Competition$ } from "@competition-manager/schemas";
import { Buttons } from "./Buttons";

type InfosProps = StepProps & {
    name: string,
    setName: (name: string) => void,
    startDate: Date | null,
    setStartDate: (startDate: Date | null) => void,
    endDate: Date | null,
    setEndDate: (endDate: Date | null) => void
}

export const Infos: React.FC<InfosProps> = ({
    handleBack,
    handleNext,
    name,
    setName,
    startDate,
    setStartDate,
    endDate,
    setEndDate
}) => {

    const [isMultiDay, setIsMultiDay] = useState(endDate ? true : false)
    const [isNameValid, setIsNameValid] = useState(Competition$.shape.name.safeParse(name).success)
    const [isStartDateValid, setIsStartDateValid] = useState(true)
    const [isEndDateValid, setIsEndDateValid] = useState(true)

    return (
        <Box
            component="form"
            onSubmit={(e) => {
                e.preventDefault()
                handleNext()
            }}
        >
            <Box 
                sx={{
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '1rem',
                    justifyContent: 'center'
                }}
            >
                <TextFieldWith$
                    id="name"
                    label={{ value: 'Name' }}
                    value={{ value: name, onChange: setName }}
                    validator={{ 
                        Schema$: Competition$.shape.name,
                        isValid: isNameValid,
                        setIsValid: setIsNameValid 
                    }}
                    required
                />

                <Box
                    sx={{
                        display: 'flex',
                        gap: '1rem',
                        flexWrap: 'wrap',
                    }}
                >
                    <DatePicker
                        label={isMultiDay ? 'Start Date' : 'Date'}
                        value={startDate}
                        onChange={(date) => setStartDate(date)}
                        onError={(error) => setIsStartDateValid(!error)}
                        format="dd/MM/yyyy"
                        disablePast
                        slotProps={{ textField: { required: true } }}
                    />
                
                    <FormControl 
                    >
                        <FormLabel
                            sx={{ textAlign: 'center' }}
                        >
                            Multi Day
                        </FormLabel>
                        <Switch
                            checked={isMultiDay}
                            onChange={() => {
                                setIsMultiDay(prev => !prev)
                                setEndDate(null)
                                setIsEndDateValid(true)
                            }}
                            sx={{ alignSelf: 'center' }}
                        />
                    </FormControl>

                    {isMultiDay && 
                        <DatePicker
                            label="End Date"
                            value={endDate}
                            onChange={(date) => setEndDate(date)}
                            onError={(error) => setIsEndDateValid(!error)}
                            format="dd/MM/yyyy"
                            disablePast
                            minDate={startDate ? new Date(startDate.getTime() + 24 * 60 * 60 * 1000) : undefined}
                            slotProps={{ textField: { required: true } }}
                        />
                    }
                </Box>
            </Box>

            <Buttons 
                buttons={[
                    { label: 'Back', onClick: handleBack },
                    { 
                        label: 'Next',
                        onClick: handleNext, 
                        disabled: !isNameValid || !startDate || !isStartDateValid || (isMultiDay && !endDate || !isEndDateValid)
                    }
                ]}
            />
        </Box>
    )
}
