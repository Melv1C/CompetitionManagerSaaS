import { BaseFieldWith$, StepperButtons } from '@/Components';
import { competitionEventDataAtom } from '@/GlobalsStates';
import {
    CompetitionEvent,
    CompetitionEvent$,
} from '@competition-manager/schemas';
import { Box } from '@mui/material';
import { useAtom } from 'jotai';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';

type CostProps = {
    handleNext: () => void;
    handleBack: () => void;
};

export const Cost: React.FC<CostProps> = ({ handleNext, handleBack }) => {
    const { t } = useTranslation();

    const [{ cost }, setCompetitionEventData] = useAtom(
        competitionEventDataAtom
    );

    const setCost = (cost: CompetitionEvent['cost']) => {
        setCompetitionEventData((prev) => ({
            ...prev,
            cost,
        }));
    };

    const [isValid, setIsValid] = useState(true);

    return (
        <Box>
            <BaseFieldWith$
                id="cost"
                type="number"
                label={{ value: t('labels:price') }}
                value={{ value: cost.toString(), onChange: (e) => setCost(+e) }}
                validator={{
                    Schema$: CompetitionEvent$.shape.cost,
                    isValid,
                    setIsValid,
                }}
                formControlProps={{ fullWidth: true }}
            />

            <StepperButtons
                buttons={[
                    {
                        label: t('buttons:previous'),
                        onClick: handleBack,
                        variant: 'outlined',
                    },
                    {
                        label: t('buttons:next'),
                        onClick: handleNext,
                        disabled: !isValid,
                    },
                ]}
            />
        </Box>
    );
};
