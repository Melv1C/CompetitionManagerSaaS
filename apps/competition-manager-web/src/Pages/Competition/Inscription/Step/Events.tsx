import { Box } from "@mui/material"
import { useTranslation } from "react-i18next";
import { StepperButtons } from "../../../../Components";

type EventsProps = {
    handleNext: () => void;
    handleBack: () => void;
}

export const Events = ({ handleNext, handleBack }: EventsProps) => {

    const { t } = useTranslation();

    return (
        <Box width={1}>
            {t('glossary:events')}
            <StepperButtons 
                buttons={[
                    { label: t('buttons:previous'), onClick: handleBack, variant: 'outlined' },
                    { label: t('buttons:next'), onClick: handleNext }
                ]}
            />
        </Box>
    )
}
