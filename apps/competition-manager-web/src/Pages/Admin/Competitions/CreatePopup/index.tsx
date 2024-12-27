import { Box, Dialog, DialogContent, DialogTitle, Step, StepContent, StepLabel, Stepper, Typography } from "@mui/material"
import { CloseButton } from "../../../../Components"
import { Plans } from "./Steps/Plans"
import { Options } from "./Steps/Options"


import { useEffect, useState } from "react"
import { Infos } from "./Steps/Infos"
import { Summary } from "./Steps/Summary"

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

    const [dataForm, setDataForm] = useState<{
        plan: string,
        options: string[],
        name: string,
        startDate: Date | null,
        endDate: Date | null
    }>({
        plan: 'basic',
        options: [],
        name: '',
        startDate: null,
        endDate: null
    })

    const steps = [
        {
            label: 'Choose Plan',
            content: <Plans handleNext={handleNext} plan={dataForm.plan} setPlan={(plan) => setDataForm(prev => ({ ...prev, plan }))} />,
        },
        {
            label: 'Select Options',
            content: <Options handleBack={handleBack} handleNext={handleNext} options={dataForm.options} setOptions={(options) => setDataForm(prev => ({ ...prev, options }))} />,
        },
        {
            label: 'Basic Information',
            content: <Infos handleBack={handleBack} handleNext={handleNext} name={dataForm.name} setName={(name) => setDataForm(prev => ({ ...prev, name }))} startDate={dataForm.startDate} setStartDate={(startDate) => setDataForm(prev => ({ ...prev, startDate }))} endDate={dataForm.endDate} setEndDate={(endDate) => setDataForm(prev => ({ ...prev, endDate }))} />,
        },
        {
            label: 'Summary',
            content: <Summary handleBack={handleBack} handleNext={handleNext} dataForm={dataForm} />,
        },
    ]

    useEffect(() => {
        const elem = activeStep === 0 ? document.getElementById('create-competition-title') : document.getElementById(`step-${activeStep}`)
        elem?.scrollIntoView({ behavior: 'smooth', block: activeStep === 0 ? 'center' : 'start' })
    }, [activeStep])

    return (
        <Dialog
            open={isVisible}
            onClose={onClose}
            fullWidth
        >
            <DialogTitle style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                <Typography variant="h5" align="center">
                    Create Competition
                </Typography>
                <CloseButton onClose={onClose} />
            </DialogTitle>
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



