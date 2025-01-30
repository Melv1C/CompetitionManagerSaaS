import { Box, Step, StepContent, StepLabel, Stepper } from "@mui/material";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { useDeviceSize } from "../../hooks";
import { Athlete } from "./Step/Athlete";
import { Events } from "./Step/Events";
import { Records } from "./Step/Records";
import { Summary } from "./Step/Summary";

type InscriptionWizardProps = {
    isAdmin?: boolean;
}


export const InscriptionWizard: React.FC<InscriptionWizardProps> = ({ 
    isAdmin = false
}) => {
    const { t } = useTranslation();

    const { isMobile } = useDeviceSize();

    const isVertical = isMobile;

    const [activeStep, setActiveStep] = useState(0);

    const handleNext = () => {
        setActiveStep((prevActiveStep) => prevActiveStep + 1);
    };

    const handleBack = () => {
        setActiveStep((prevActiveStep) => prevActiveStep - 1);
    };

    const steps = [
        { label: t('glossary:athlete'), content: <Athlete isAdmin={isAdmin} handleNext={handleNext} /> },
        { label: t('glossary:events'), content: <Events isAdmin={isAdmin} handleNext={handleNext} handleBack={handleBack} /> },
        { label: t('glossary:personalBest'), content: <Records isAdmin={isAdmin} handleNext={handleNext} handleBack={handleBack} /> },
        { label: t('glossary:summary'), content: <Summary isAdmin={isAdmin} handleBack={handleBack} /> }
    ];

    return (
        <>
            <Stepper 
                activeStep={activeStep} 
                orientation={isVertical ? 'vertical' : 'horizontal'} 
                alternativeLabel={!isVertical}
                sx={{ mb: 4 }}
            >
                {steps.map((step) => (
                    <Step key={step.label}>
                        <StepLabel>{step.label}</StepLabel>
                        {isVertical && (
                            <StepContent>
                                {step.content}
                            </StepContent>
                        )}
                    </Step>
                ))}
            </Stepper>

            {!isVertical && (
                <Box display="flex" flexDirection="column" alignItems="center" width="80%" mx="auto" maxWidth={400}>
                    {steps[activeStep].content}
                </Box>
            )}
        </>
    )
}
