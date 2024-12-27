import { Box, Card, CardActionArea, Checkbox, Typography } from "@mui/material"
import { StepProps } from ".."
import { Buttons } from "./Buttons"

type Options = {
    name: string
    description: string
    price: number
}

const OPTIONS: Options[] = [
    {
        name: 'Option 1',
        description: 'Description 1',
        price: 5
    },
    {
        name: 'Option 2',
        description: 'Description 2',
        price: 10
    },
    {
        name: 'Option 3',
        description: 'Description 3',
        price: 15
    }
]

type OptionssProps = StepProps & {
    options: string[]
    setOptions: (options: string[]) => void
}

export const Options = ({
    handleBack,
    handleNext,
    options,
    setOptions
}: OptionssProps) => {
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
            {OPTIONS.map(({ name, description, price }) => (
                <Card
                    key={name}
                    sx={{
                        display: 'flex',
                        flexDirection: 'column'
                    }}
                >
                    <CardActionArea onClick={() => {
                        if (options.includes(name)) {
                            setOptions(options.filter((option) => option !== name))
                        } else {
                            setOptions([...options, name])
                        }
                    }}>
                        <Box 
                            sx={{ 
                                display: 'flex', 
                                gap: '1rem', 
                                alignItems: 'center',
                                padding: '0.5rem',
                                backgroundColor: (theme) => options.includes(name) ? `${theme.palette.primary.main}20` : 'transparent'
                            }}
                        >
                            <Checkbox checked={options.includes(name)} />
                            <Box sx={{ display: 'flex', flexDirection: 'column', flex: 1 }}>
                                <Typography variant="subtitle1">
                                    {name}
                                </Typography>
                                <Typography variant="body2" color="textSecondary">
                                    {description}
                                    </Typography>
                            </Box>
                            <Typography variant="h6" color="secondary" sx={{ marginRight: '1rem' }}>
                                {price}€
                            </Typography>
                        </Box>
                    </CardActionArea>
                </Card>
            ))}

                
        </Box>

        <Buttons buttons={[
            { label: 'Back', onClick: handleBack },
            { label: 'Next', onClick: handleNext }
        ]} />
    </>
  )
}
