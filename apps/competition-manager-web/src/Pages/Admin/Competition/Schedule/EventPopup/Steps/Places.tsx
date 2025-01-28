import { Box, FormControlLabel, Switch } from "@mui/material";
import { BaseFieldWith$, StepperButtons } from "../../../../../../Components";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { CompetitionEvent, Place$ } from "@competition-manager/schemas";
import { useAtom } from "jotai";
import { competitionEventDataAtom } from "../../../../../../GlobalsStates";

type PlacesProps = {
    handleNext: () => void;
    handleBack: () => void;
};

export const Places: React.FC<PlacesProps> = ({ 
    handleNext, 
    handleBack,
}) => {

    const { t } = useTranslation()

    const [{place}, setCompetitionEventData] = useAtom(competitionEventDataAtom);

    const setPlace = (place: CompetitionEvent["place"]) => {
        setCompetitionEventData((prev) => ({
            ...prev,
            place,
        }))
    }


    const [hasLimit, setHasLimit] = useState(place !== undefined && place !== null)
    
    const [isValid, setIsValid] = useState(true)
    
    const isDisabled = !isValid || (hasLimit && !place)
    
    const toggleLimit = () => {
        setHasLimit(!hasLimit)
        setPlace(undefined)
        setIsValid(true)
    }

    return (
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>

            <FormControlLabel 
                control={<Switch checked={hasLimit} onChange={toggleLimit} />}
                label={t('eventPopup:hasPlaceLimit')}
                sx={{ width: 'fit-content' }}
            />

            {hasLimit && (
                <BaseFieldWith$
                    id="placeLimit"
                    type="number"
                    label={{ value: t('labels:placeLimit') }}
                    value={{ value: place, onChange: setPlace }}
                    validator={{ Schema$: Place$, isValid, setIsValid }}
                    formControlProps={{ fullWidth: true }}
                />
            )}

            <StepperButtons
                buttons={[
                    { label: t('buttons:previous'), onClick: handleBack, variant: 'outlined' },
                    { label: t('buttons:next'), onClick: handleNext, disabled: isDisabled }
                ]}
            />
        </Box>
    );
}
