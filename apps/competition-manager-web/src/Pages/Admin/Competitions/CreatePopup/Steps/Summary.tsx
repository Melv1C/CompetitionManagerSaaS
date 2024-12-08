import { Box } from "@mui/material"
import { Buttons } from "./Buttons"
import { StepProps } from ".."

type SummaryProps = StepProps & {
    dataForm : {
        plan: string,
        options: string[],
        name: string,
        startDate: Date | null,
        endDate: Date | null
    }
}

export const Summary: React.FC<SummaryProps> = ({
    handleBack,
    handleNext,
    dataForm
}) => {
    return (
        <Box>

            <Box 
                sx={{
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '1rem',
                    justifyContent: 'center'
                }}
            >
                <Box>
                    <Box>
                        <Box>Plan: {dataForm.plan}</Box>
                        <Box>Options: {dataForm.options.join(', ')}</Box>
                    </Box>

                    <Box>
                        <Box>Name: {dataForm.name}</Box>
                        <Box>Start Date: {dataForm.startDate?.toLocaleDateString()}</Box>
                        {dataForm.endDate && <Box>End Date: {dataForm.endDate?.toLocaleDateString()}</Box>}
                    </Box>
                </Box>
            </Box>
            
            <Buttons buttons={
                [
                    { label: 'Back', onClick: handleBack },
                    { label: 'Pay', onClick: handleNext }
                ]
            } />
        </Box>
    )
}
