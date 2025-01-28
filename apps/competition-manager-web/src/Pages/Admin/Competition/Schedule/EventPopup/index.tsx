import { Box, Dialog, DialogContent, DialogTitle, Step, StepContent, StepLabel, Stepper } from "@mui/material"
import { useEffect, useState } from "react"
import { CloseButton } from "../../../../../Components"
import { Category, CompetitionEvent, Event, PaymentMethod } from "@competition-manager/schemas"
import { SelectEventCategory } from "./Steps/SelectEventCategory"
import { Infos } from "./Steps/Infos"
import { competitionAtom } from "../../../../../GlobalsStates"
import { useAtomValue } from "jotai"
import { Summary } from "./Steps/Summary"
import { useTranslation } from "react-i18next"
import { Places } from "./Steps/Places"
import { Cost } from "./Steps/Cost"

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

    const { t } = useTranslation('eventPopup')

    const competition = useAtomValue(competitionAtom)

    if (!competition) throw new Error('No competition found')

    const [selectedEvent, setSelectedEvent] = useState<Event | undefined>(initialEvent?.event)
    const [selectedCategories, setSelectedCategories] = useState<Category[]>(initialEvent?.categories || [])
    const [name, setName] = useState<CompetitionEvent["name"]>(initialEvent?.name || '')
    const [schedule, setSchedule] = useState<CompetitionEvent["schedule"] | undefined>(initialEvent?.schedule)
    const [place, setPlace] = useState<CompetitionEvent["place"]>(initialEvent?.place)
    const [cost, setCost] = useState<CompetitionEvent["cost"]>(initialEvent?.cost || 0)
    
    const [activeStep, setActiveStep] = useState(0)

    const handleNext = () => {
        setActiveStep((prev) => prev + 1)
    }

    const handleBack = () => {
        setActiveStep((prev) => prev - 1)
    }

    const steps = [
        { label: `${t('glossary:event')} & ${t('glossary:categories')}`, content: <SelectEventCategory handleNext={handleNext} selectedEvent={selectedEvent} onSelectedEvent={setSelectedEvent} selectedCategories={selectedCategories} onSelectedCategories={setSelectedCategories} /> },
        { label: t('basicInformation'), content: <Infos handleBack={handleBack} handleNext={handleNext} name={name} setName={setName} schedule={schedule} setSchedule={setSchedule} /> },
        { label: t('glossary:places'), content: <Places handleBack={handleBack} handleNext={handleNext} place={place} setPlace={setPlace} /> },
        ...(competition.method !== PaymentMethod.FREE ? [{ label: t('paymentInformation'), content: <Cost handleBack={handleBack} handleNext={handleNext} cost={cost} setCost={setCost} /> }] : []),
        { label: t('glossary:summary'), content: 
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
                    {initialEvent ? t('editEvent') : t('createEvent')}
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