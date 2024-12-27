import { Box, Card, CardActionArea, CardContent, CardHeader, Typography } from "@mui/material"
import { StepProps } from ".."
import { Buttons } from "./Buttons"

type PlansProps = Omit<StepProps, 'handleBack'> & {
    plan: string
    setPlan: (plan: string) => void
}

export const Plans: React.FC<PlansProps> = ({
    handleNext,
    plan,
    setPlan
}) => {

    const plans = [
        {
            title: 'Basic Plan',
            value: 'basic',
            price: 5,
            advantages: [
                'Advantage 1',
                'Advantage 2',
                'Advantage 3',
            ],
        },
        {
            title: 'Premium Plan',
            value: 'premium',
            price: 10,
            advantages: [
                'Advantage 1',
                'Advantage 2',
                'Advantage 3',
            ],
        }
    ]

    return (
        <>
            <Box
                sx={{
                    display: 'flex',
                    gap: '2rem',
                    justifyContent: 'center'
                }}
            >

                {plans.map(({ title, value, price, advantages }) => (
                    <Plan 
                        key={value}
                        title={title}
                        isSelected={plan === value}
                        onSelect={() => setPlan(value)}
                        price={price}
                        advantages={advantages}
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
    advantages: string[]
}

const Plan: React.FC<PlanProps> = ({
    title,
    isSelected,
    onSelect,
    price,
    advantages
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
                // remove the hover effect
                sx={{ 

                }}
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
                            {advantages.map((advantage, index) => (
                                <Typography key={index} align="center" variant="body2">
                                    {advantage}
                                </Typography>
                            ))}
                        </Box>
                    </Box>
                </CardContent>
            </CardActionArea>

        </Card>
    )
}
