import { Box, Dialog, DialogContent, DialogTitle, Step, StepContent, StepLabel, Stepper } from "@mui/material"
import { useEffect, useState } from "react"
import { CloseButton, StepperButtons } from "../../../../../Components"
import { SelectEvent } from "./SelectEvent"
import { Event } from "@competition-manager/schemas"

export type StepProps = {
    handleBack: () => void
    handleNext: () => void
}

type CreatePopupProps = {  
    isVisible: boolean
    onClose: () => void
}

export const CreatePopup: React.FC<CreatePopupProps> = ({ isVisible, onClose }) => {

    const [selectedEvent, setSelectedEvent] = useState<Event>()
    
    const [activeStep, setActiveStep] = useState(0)

    const handleNext = () => {
        setActiveStep((prev) => prev + 1)
    }

    const handleBack = () => {
        setActiveStep((prev) => prev - 1)
    }

    const steps = [
        { label: 'Select Event', content: <SelectEvent handleNext={handleNext} selectedEvent={selectedEvent} onSelect={setSelectedEvent} /> },
        { label: 'Step 2', content: 
        <Box>
            Step 2 content
            <StepperButtons
                buttons={[
                    { label: 'Back', onClick: handleBack },
                    { label: 'Next', onClick: handleNext },
                ]}
            />
        </Box> },
        { label: 'Step 3', content: 
        <Box>
            Step 3 content
            <StepperButtons
                buttons={[
                    { label: 'Back', onClick: handleBack },
                    { label: 'Next', onClick: handleNext },
                ]}
            />
        </Box> },
    ]

    useEffect(() => {
        const elem = activeStep === 0 ? document.getElementById('create-competition-event-title') : document.getElementById(`step-${activeStep}`)
        elem?.scrollIntoView({ behavior: 'smooth', block: activeStep === 0 ? 'center' : 'start' })
    }, [activeStep])

    useEffect(() => {
        if (activeStep === steps.length) {
            onClose()
        }
    }, [activeStep, onClose, steps.length])

    return (
        <Dialog
            open={isVisible}
            onClose={onClose}
            maxWidth="sm"
            fullWidth
        >
            <Box>
                <DialogTitle variant="h5" align="center" id="create-competition-event-title">
                    Create Competition Event
                </DialogTitle>
                <CloseButton onClose={onClose} />
            </Box>
            <DialogContent>
                <Stepper activeStep={activeStep} orientation="vertical">
                    {steps.map((step, index) => (
                        <Step key={index}>
                            <StepLabel id={`step-${index}`}>
                                {step.label}
                            </StepLabel>
                            <StepContent>
                                <Box sx={{ mt: 2 }}>
                                    {step.content}
                                </Box>
                            </StepContent>
                        </Step>
                    ))}
                </Stepper>
            </DialogContent>
        </Dialog>
    )
}