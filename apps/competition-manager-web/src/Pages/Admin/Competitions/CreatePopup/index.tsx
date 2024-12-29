import { Box, Dialog, DialogContent, DialogTitle, Step, StepContent, StepLabel, Stepper } from "@mui/material"
import { CloseButton } from "../../../../Components"
import { Plans } from "./Steps/Plans"
import { Options } from "./Steps/Options"


import { useEffect, useState } from "react"
import { Infos } from "./Steps/Infos"
import { Summary } from "./Steps/Summary"
import { Option, PaymentPlan } from "@competition-manager/schemas"
import { getOptions, getPlans } from "../../../../api"

export type StepProps = {
    handleBack: () => void
    handleNext: () => void
}

type CreatePopupProps = {  
    isVisible: boolean
    onClose: () => void
}

export const CreatePopup: React.FC<CreatePopupProps> = ({ isVisible, onClose }) => {
    
    const [activeStep, setActiveStep] = useState(0)

    const handleNext = () => {
        setActiveStep((prev) => prev + 1)
    }

    const handleBack = () => {
        setActiveStep((prev) => prev - 1)
    }

    const [plans, setPlans] = useState<PaymentPlan[]>([])
    const [options, setOptions] = useState<Option[]>([])

    const [plan, setPlan] = useState<PaymentPlan>();
    const [selectedOptions, setSelectedOptions] = useState<Option[]>([]);
    const [name, setName] = useState<string>('');
    const [date, setDate] = useState<Date>();
    const [closeDate, setCloseDate] = useState<Date>();

    const steps = [
        {
            label: 'Choose Plan',
            content: <Plans handleNext={handleNext} plans={plans} plan={plan!} setPlan={setPlan} />,
        },
        {
            label: 'Select Options',
            content: <Options handleBack={handleBack} handleNext={handleNext} plan={plan!} options={options} selectedOptions={selectedOptions} setSelectedOptions={setSelectedOptions} />,
        },
        {
            label: 'Basic Information',
            content: <Infos handleBack={handleBack} handleNext={handleNext} name={name} setName={setName} date={date} setDate={setDate} closeDate={closeDate} setCloseDate={setCloseDate} />,
        },
        {
            label: 'Summary',
            content: <Summary handleBack={handleBack} handleNext={handleNext} dataForm={{ plan: plan!, selectedOptions, name, date: date!, closeDate }} />,
        },
    ]

    useEffect(() => {
        getPlans().then(plans => {
            setPlans(plans)
            setPlan(plans[0])
        }).catch(console.error)
        getOptions().then(setOptions).catch(console.error)
    }, [])

    useEffect(() => {
        const elem = activeStep === 0 ? document.getElementById('create-competition-title') : document.getElementById(`step-${activeStep}`)
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
            fullWidth
        >
            <Box>
                <DialogTitle variant="h5" align="center">
                    Create Competition
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



