import { Box, Dialog, DialogContent, DialogTitle, Step, StepContent, StepLabel, Stepper } from "@mui/material"
import { useEffect, useState } from "react"
import { CloseButton, StepperButtons } from "../../../../../Components"
import { Category, CompetitionEvent, Event, PaymentMethod } from "@competition-manager/schemas"
import { SelectEventCategory } from "./Steps/SelectEventCategory"
import { Infos } from "./Steps/Infos"
import { competitionAtom } from "../../../../../GlobalsStates"
import { useAtomValue } from "jotai"
import { Summary } from "./Steps/Summary"

export type StepProps = {
    handleBack: () => void
    handleNext: () => void
}

type EventPopupProps = {  
    isVisible: boolean
    onClose: () => void
    initialEvent?: CompetitionEvent
}

export const EventPopup: React.FC<EventPopupProps> = ({ isVisible, onClose, initialEvent }) => {

    const competition = useAtomValue(competitionAtom)

    if (!competition) throw new Error('No competition found')

    const [selectedEvent, setSelectedEvent] = useState<Event | undefined>(initialEvent?.event)
    const [selectedCategories, setSelectedCategories] = useState<Category[]>(initialEvent?.categories || [])
    const [name, setName] = useState<CompetitionEvent["name"]>(initialEvent?.name || '')
    const [schedule, setSchedule] = useState<CompetitionEvent["schedule"] | undefined>(initialEvent?.schedule)
    const [place] = useState<CompetitionEvent["place"]>(initialEvent?.place)
    const [cost] = useState<CompetitionEvent["cost"]>(initialEvent?.cost || 0)
    
    const [activeStep, setActiveStep] = useState(0)

    const handleNext = () => {
        setActiveStep((prev) => prev + 1)
    }

    const handleBack = () => {
        setActiveStep((prev) => prev - 1)
    }

    const steps = [
        { label: 'Event & Categories', content: <SelectEventCategory handleNext={handleNext} selectedEvent={selectedEvent} onSelectedEvent={setSelectedEvent} selectedCategories={selectedCategories} onSelectedCategories={setSelectedCategories} /> },
        { label: 'Basic Information', content: <Infos handleBack={handleBack} handleNext={handleNext} name={name} setName={setName} schedule={schedule} setSchedule={setSchedule} /> },
        { label: 'Places', content: 
        <Box>
            Step 3 content
            <StepperButtons
                buttons={[
                    { label: 'Back', onClick: handleBack },
                    { label: 'Next', onClick: handleNext },
                ]}
            />
        </Box> },
        ...(competition.method !== PaymentMethod.FREE ? [{ label: 'Payment', content:
        <Box>
            Payment content
            <StepperButtons
                buttons={[
                    { label: 'Back', onClick: handleBack },
                    { label: 'Next', onClick: handleNext },
                ]}
            />
        </Box> }] : []),
        { label: 'Summary', content: 
            <Summary 
                handleBack={handleBack} 
                handleNext={handleNext} 
                competitionEvent={{ 
                    id: initialEvent?.id || 0,
                    eid: initialEvent?.eid || '',
                    name, 
                    schedule: schedule!,
                    place, 
                    cost, 
                    event: selectedEvent!, 
                    categories: selectedCategories, 
                    isInscriptionOpen: true,
                }} 
            />
        },
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