import { Box } from "@mui/material"
import { useTranslation } from "react-i18next"
import { BaseFieldWith$, StepperButtons } from "../../../../../../Components"
import { CompetitionEvent, CompetitionEvent$ } from "@competition-manager/schemas"
import { useState } from "react"
import { useAtom } from "jotai"
import { competitionEventDataAtom } from "../../../../../../GlobalsStates"

type CostProps = {
    handleNext: () => void
    handleBack: () => void
}


export const Cost: React.FC<CostProps> = ({
    handleNext,
    handleBack
}) => {

    const { t } = useTranslation()

    const [{cost}, setCompetitionEventData] = useAtom(competitionEventDataAtom);

    const setCost = (cost: CompetitionEvent["cost"]) => {
        setCompetitionEventData((prev) => ({
            ...prev,
            cost,
        }))
    }

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
