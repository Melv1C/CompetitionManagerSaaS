import { Box, FormControl, FormLabel, Switch } from "@mui/material"
import { DatePicker } from '@mui/x-date-pickers';
import { StepProps } from ".."
import { useState } from "react";
import { TextFieldWith$ } from "../../../../../Components/FieldsWithSchema";
import { Competition$ } from "@competition-manager/schemas";
import { StepperButtons as Buttons } from "../../../../../Components";

type InfosProps = StepProps & {
    name: string,
    setName: (name: string) => void,
    date?: Date,
    setDate: (date?: Date) => void,
    closeDate?: Date,
    setCloseDate: (date?: Date) => void,
}

export const Infos: React.FC<InfosProps> = ({
    handleBack,
    handleNext,
    name,
    setName,
    date,
    setDate,
    closeDate,
    setCloseDate,
}) => {

    const [isMultiDay, setIsMultiDay] = useState(closeDate ? true : false)
    const [isNameValid, setIsNameValid] = useState(Competition$.shape.name.safeParse(name).success)
    const [isDateValid, setIsDateValid] = useState(true)
    const [isCloseDateValid, setIsCloseDateValid] = useState(true)

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
                        value={date}
                        onChange={(date) => setDate(date || undefined)}
                        onError={(error) => setIsDateValid(!error)}
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
                                setCloseDate(undefined)
                                setIsCloseDateValid(true)
                            }}
                            sx={{ alignSelf: 'center' }}
                        />
                    </FormControl>

                    {isMultiDay && 
                        <DatePicker
                            label="Close Date"
                            value={closeDate}
                            onChange={(date) => setCloseDate(date || undefined)}
                            onError={(error) => setIsCloseDateValid(!error)}
                            format="dd/MM/yyyy"
                            disablePast
                            minDate={date ? new Date(date.getTime() + 24 * 60 * 60 * 1000) : undefined}
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
                        disabled: !isNameValid || !date || !isDateValid || (isMultiDay && !closeDate || !isCloseDateValid)
                    }
                ]}
            />
        </Box>
    )
}
