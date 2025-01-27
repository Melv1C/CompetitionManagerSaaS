import { Box } from "@mui/material"
import { useTranslation } from "react-i18next"
import { BaseFieldWith$, StepperButtons } from "../../../../../../Components"
import { CompetitionEvent, CompetitionEvent$ } from "@competition-manager/schemas"
import { useState } from "react"

type CostProps = {
    handleNext: () => void
    handleBack: () => void
    cost: CompetitionEvent["cost"]
    setCost: (cost: CompetitionEvent["cost"]) => void
}


export const Cost: React.FC<CostProps> = ({
    handleNext,
    handleBack,
    cost,
    setCost
}) => {

    const { t } = useTranslation()

    const [isValid, setIsValid] = useState(true)

    return (
        <Box>

            <BaseFieldWith$
                id="cost"
                type="number"
                label={{ value: t('labels:price') }}
                value={{ value: cost, onChange: setCost }}
                validator={{ Schema$: CompetitionEvent$.shape.cost, isValid, setIsValid }}
                formControlProps={{ fullWidth: true }}
            />

            <StepperButtons
                buttons={[
                    { label: t('buttons:previous'), onClick: handleBack, variant: 'outlined' },
                    { label: t('buttons:next'), onClick: handleNext, disabled: !isValid }
                ]}
            />
        </Box>
    )
}
