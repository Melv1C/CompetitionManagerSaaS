import { Box, Button, FormControl, FormLabel, Switch } from "@mui/material"
import { DatePicker } from '@mui/x-date-pickers';
import { StepProps } from ".."
import { useState } from "react";
import { TextFieldWith$ } from "../../../../../Components/FieldsWithSchema";
import { Competition$ } from "@competition-manager/schemas";

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

    const [isMultiDay, setIsMultiDay] = useState(false)
    const [isNameValid, setIsNameValid] = useState(false)

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
                            onChange={() => setIsMultiDay(prev => !prev)}
                            sx={{ alignSelf: 'center' }}
                        />
                    </FormControl>

                    {isMultiDay && 
                        <DatePicker
                            label="End Date"
                            value={endDate}
                            onChange={(date) => setEndDate(date)}
                            format="dd/MM/yyyy"
                            disablePast
                            minDate={startDate || undefined}
                            slotProps={{ textField: { required: true } }}
                        />
                    }
                </Box>
            </Box>

            <Box sx={{ display: 'flex', gap: '1rem', mt: 4 }}>
                <Button
                    variant="contained"
                    onClick={handleBack}
                >
                    Back
                </Button>
                <Button
                    variant="contained"
                    type="submit"
                >
                    Next
                </Button>
            </Box>
        </Box>
    )
}
