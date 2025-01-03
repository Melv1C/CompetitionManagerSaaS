import { Box, Card, CardActionArea, CardContent, CardHeader, Typography } from "@mui/material"
import { StepProps } from ".."
import { StepperButtons as Buttons } from "../../../../../Components";
import { PaymentPlan } from "@competition-manager/schemas"

type PlansProps = Omit<StepProps, 'handleBack'> & {
    plans: PaymentPlan[]
    plan: PaymentPlan
    setPlan: (plan: PaymentPlan) => void
}

export const Plans: React.FC<PlansProps> = ({
    handleNext,
    plans,
    plan,
    setPlan
}) => {

    return (
        <>
            <Box
                sx={{
                    display: 'flex',
                    gap: '2rem',
                    justifyContent: 'center'
                }}
            >

                {plans.sort((a, b) => a.price - b.price).map(p => (
                    <Plan 
                        key={p.id}
                        title={p.name}
                        isSelected={plan.id === p.id}
                        onSelect={() => setPlan(p)}
                        price={p.price}
                        description={p.description}
                    />
                ))}

            </Box>

            <Buttons 
                buttons={[
                    { label: 'Next', onClick: handleNext, disabled: !plan }
                ]}
            />
        </>
    )
}


type PlanProps = {
    title: string
    isSelected: boolean
    onSelect: () => void
    price: number
    description: string
}

const Plan: React.FC<PlanProps> = ({
    title,
    isSelected,
    onSelect,
    price,
    description
}) => {
    return (
        <Card 
            sx={{ 
                width: 200,
                boxShadow: isSelected ? 10 : 1,
                transform: isSelected ? 'scale(1.1)' : 'scale(1)',
                transition: 'transform 0.3s, box-shadow 0.3s',
            }}
        >
            <CardActionArea 
                onClick={onSelect}
            >
                <CardHeader 
                    title={title} 
                    sx={{ 
                        textAlign: 'center',
                        backgroundColor: isSelected ? 'primary.main' : 'secondary.main',
                        color: 'secondary.contrastText',
                        padding: '0.5rem'
                    }}
                    titleTypographyProps={{ variant: 'h6' }}
                />
                <CardContent>
                    <Box 
                        sx={{ 
                            display: 'flex', 
                            flexDirection: 'column', 
                            gap: '1rem',
                            alignItems: 'center'
                        }}
                    >
                        <Box>
                            <Typography variant="h4" align="center" color={isSelected ? 'primary' : 'secondary'}>
                                {price}€
                            </Typography>
                        </Box>
                        <Box>
                            <Typography variant="body1" align="center" color={isSelected ? 'primary' : 'secondary'}>
                                {description}
                            </Typography>
                        </Box>
                    </Box>
                </CardContent>
            </CardActionArea>
        </Card>
    )
}
