import { CloseButton } from '@/Components';
import { competitionAtom, competitionEventDataAtom } from '@/GlobalsStates';
import { CompetitionEvent, PaymentMethod } from '@competition-manager/schemas';
import {
    Box,
    Dialog,
    DialogContent,
    DialogTitle,
    Step,
    StepContent,
    StepLabel,
    Stepper,
} from '@mui/material';
import { useAtomValue, useSetAtom } from 'jotai';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Cost } from './Steps/Cost';
import { Infos } from './Steps/Infos';
import { Places } from './Steps/Places';
import { SelectEventCategory } from './Steps/SelectEventCategory';
import { Summary } from './Steps/Summary';

export type StepProps = {
    handleBack: () => void;
    handleNext: () => void;
};

type EventPopupProps = {
    isVisible: boolean;
    onClose: () => void;
    initialEvent?: CompetitionEvent;
    initialChildren?: CompetitionEvent[];
};

export const EventPopup: React.FC<EventPopupProps> = ({
    isVisible,
    onClose,
    initialEvent,
    initialChildren = [],
}) => {
    const { t } = useTranslation('eventPopup');

    const competition = useAtomValue(competitionAtom);
    if (!competition) throw new Error('No competition found');

    const setCompetitionEventData = useSetAtom(competitionEventDataAtom);

    const [activeStep, setActiveStep] = useState(0);

    const handleNext = () => {
        setActiveStep((prev) => prev + 1);
    };

    const handleBack = () => {
        setActiveStep((prev) => prev - 1);
    };

    const steps = [
        {
            label: `${t('glossary:event')} & ${t('glossary:categories')}`,
            content: <SelectEventCategory handleNext={handleNext} />,
        },
        {
            label: t('basicInformation'),
            content: <Infos handleBack={handleBack} handleNext={handleNext} />,
        },
        {
            label: t('glossary:places'),
            content: <Places handleBack={handleBack} handleNext={handleNext} />,
        },
        ...(competition.method !== PaymentMethod.FREE
            ? [
                  {
                      label: t('paymentInformation'),
                      content: (
                          <Cost
                              handleBack={handleBack}
                              handleNext={handleNext}
                          />
                      ),
                  },
              ]
            : []),
        {
            label: t('glossary:summary'),
            content: (
                <Summary handleBack={handleBack} handleNext={handleNext} />
            ),
        },
    ];

    useEffect(() => {
        const elem =
            activeStep === 0
                ? document.getElementById('create-competition-event-title')
                : document.getElementById(`step-${activeStep}`);
        elem?.scrollIntoView({
            behavior: 'smooth',
            block: activeStep === 0 ? 'center' : 'start',
        });
    }, [activeStep]);

    useEffect(() => {
        if (activeStep === steps.length) {
            onClose();
        }
    }, [activeStep, onClose, steps.length]);

    useEffect(() => {
        if (initialEvent) {
            setCompetitionEventData({
                eid: initialEvent.eid,
                event: initialEvent.event,
                categories: initialEvent.categories,
                name: initialEvent.name,
                schedule: initialEvent.schedule,
                place: initialEvent.place,
                cost: initialEvent.cost,
                children: initialChildren.map((child) => ({
                    eid: child.eid,
                    event: child.event,
                    name: child.name,
                    schedule: child.schedule,
                })),
            });
        }
    }, [initialChildren, initialEvent, setCompetitionEventData]);

    return (
        <Dialog open={isVisible} onClose={onClose} maxWidth="sm" fullWidth>
            <Box>
                <DialogTitle
                    variant="h5"
                    align="center"
                    id="create-competition-event-title"
                >
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
                                <Box sx={{ mt: 2 }}>{step.content}</Box>
                            </StepContent>
                        </Step>
                    ))}
                </Stepper>
            </DialogContent>
        </Dialog>
    );
};
