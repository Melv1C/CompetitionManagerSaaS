import { Box, Step, StepContent, StepLabel, Stepper } from "@mui/material";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { useDeviceSize } from "../../../hooks";
import { Athlete } from "./Step/Athlete";
import { Events } from "./Step/Events";


export const Inscription = () => {

    const { t } = useTranslation();

    const { isMobile } = useDeviceSize();

    const [activeStep, setActiveStep] = useState(0);

    const handleNext = () => {
        setActiveStep((prevActiveStep) => prevActiveStep + 1);
    };

    const handleBack = () => {
        setActiveStep((prevActiveStep) => prevActiveStep - 1);
    };

    const steps = [
        { label: t('glossary:athlete'), content: <Athlete handleNext={handleNext} /> },
        { label: t('glossary:events'), content: <Events handleNext={handleNext} handleBack={handleBack} /> },
        { label: t('glossary:personalBest') },
        { label: t('glossary:summary') }
    ];

    return (
        <Box>
            <Stepper 
                activeStep={activeStep} 
                orientation={isMobile ? 'vertical' : 'horizontal'} 
                alternativeLabel={!isMobile}
                sx={{ mb: 4 }}
            >
                {steps.map((step) => (
                    <Step key={step.label}>
                        <StepLabel>{step.label}</StepLabel>
                        {isMobile && (
                            <StepContent>
                                {step.content}
                            </StepContent>
                        )}
                    </Step>
                ))}
            </Stepper>

            {!isMobile && (
                <Box display="flex" flexDirection="column" alignItems="center" width="80%" mx="auto">
                    {steps[activeStep].content}
                </Box>
            )}
        </Box>
    )
}
