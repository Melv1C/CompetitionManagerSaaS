import { Box, Card, CardActionArea, Checkbox, Typography } from "@mui/material"
import { StepProps } from ".."
import { StepperButtons as Buttons } from "../../../../../Components";
import { Option, PaymentPlan } from "@competition-manager/schemas"
import { useTranslation } from "react-i18next";

type OptionssProps = StepProps & {
    plan: PaymentPlan
    options: Option[]
    selectedOptions: Option[]
    setSelectedOptions: (options: Option[]) => void
}

export const Options: React.FC<OptionssProps> = ({
    handleBack,
    handleNext,
    plan,
    options,
    selectedOptions,
    setSelectedOptions
}) => {

    const { t } = useTranslation()

    const isSelected = (option: Option) => selectedOptions.map(o => o.id).includes(option.id)
    const isIncluded = (option: Option) => plan.includedOptions.map(o => o.id).includes(option.id)

    return (
        <>
            <Box
                sx={{
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '1rem',
                    justifyContent: 'center'

                }}
            >

                {options.map(option => (
                    <Card
                        key={option.id}
                        sx={{
                            display: 'flex',
                            flexDirection: 'column'
                        }}
                    >
                        <CardActionArea 
                            disabled={isIncluded(option)}
                            onClick={() => {
                                if (isSelected(option)) {
                                    setSelectedOptions(selectedOptions.filter(o => o.id !== option.id))
                                } else {
                                    setSelectedOptions([...selectedOptions, option])
                                }
                            }}
                        >
                            <Box 
                                sx={{ 
                                    display: 'flex', 
                                    gap: '1rem', 
                                    alignItems: 'center',
                                    padding: '0.5rem',
                                    backgroundColor: (theme) => (isSelected(option) || isIncluded(option)) ? `${theme.palette.primary.main}20` : 'transparent'
                                }}
                            >
                                <Checkbox checked={isSelected(option) || isIncluded(option)} disabled={isIncluded(option)} />
                                <Box sx={{ display: 'flex', flexDirection: 'column', flex: 1 }}>
                                    <Typography variant="subtitle1">
                                        {option.name}
                                    </Typography>
                                    <Typography variant="body2" color="textSecondary">
                                        {option.description}
                                    </Typography>
                                </Box>
                                {isIncluded(option) && (
                                    <Typography variant="h6" color="textSecondary">
                                        Included
                                    </Typography>
                                )}
                                <Typography 
                                    variant="h6" 
                                    color={isIncluded(option) ? 'textSecondary' : 'secondary'}
                                    sx={{ marginRight: '1rem' }}
                                >
                                    {option.price}€
                                </Typography>

                            </Box>
                        </CardActionArea>
                    </Card>
                ))}
            </Box>

            <Buttons buttons={[
                { label: t('buttons:back'), onClick: handleBack },
                { label: t('buttons:next'), onClick: handleNext }
            ]} />
        </>
    )
}
