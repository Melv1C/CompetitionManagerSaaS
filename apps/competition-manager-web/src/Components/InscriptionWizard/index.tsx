import { Box, Step, StepContent, StepLabel, Stepper } from "@mui/material";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useDeviceSize, useSnackbar } from "../../hooks";
import { Athlete } from "./Step/Athlete";
import { Events } from "./Step/Events";
import { Records } from "./Step/Records";
import { Summary } from "./Step/Summary";
import { useSearchParams } from "react-router-dom";
import { Success } from "./Step/Success";

type InscriptionWizardProps = {
    isAdmin?: boolean;
}


export const InscriptionWizard: React.FC<InscriptionWizardProps> = ({ 
    isAdmin = false
}) => {
    const { t } = useTranslation();

    const [searchParams, setSearchParams] = useSearchParams();

    const { showSnackbar } = useSnackbar();

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
        { label: t('glossary:summary'), content: <Summary isAdmin={isAdmin} handleBack={handleBack} handleNext={handleNext} /> }
    ];

    useEffect(() => {
        const step = searchParams.has('isPending') ? steps.length : null;
        if (step !== null) setActiveStep(step);
    }, [searchParams]);

    useEffect(() => {
        if (searchParams.has('isCanceled')) {
            setActiveStep(0);
            showSnackbar(t('inscription:cancel'), 'warning');
            searchParams.delete('isCanceled');
            setSearchParams(searchParams);
        }
    }, [searchParams]);

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
                                {activeStep < steps.length && step.content}
                            </StepContent>
                        )}
                    </Step>
                ))}
            </Stepper>

            {!isVertical && (
                <Box display="flex" flexDirection="column" alignItems="center" width="80%" mx="auto" maxWidth={500}>
                    {activeStep === steps.length ? (
                        <Success handleResart={() => setActiveStep(0)} />
                    ) : (
                        steps[activeStep].content
                    )}
                </Box>
            )}

            {isVertical && activeStep === steps.length && (
                <Box display="flex" flexDirection="column" alignItems="center" width="80%" mx="auto" maxWidth={500}>
                    <Success handleResart={() => setActiveStep(0)} />
                </Box>
            )}
        </>
    )
}
