import { Box } from "@mui/material"
import { StepperButtons as Buttons } from "../../../../../Components";
import { StepProps } from ".."
import { PaymentPlan, Option, CreateCompetition$ } from "@competition-manager/schemas"
import { createCompetition } from "../../../../../api"
import { useNavigate } from "react-router-dom"

type SummaryProps = Omit<StepProps, 'handleNext'> & {
    dataForm : {
        plan: PaymentPlan
        selectedOptions: Option[],
        name: string,
        date: Date,
        closeDate?: Date
    }
}

export const Summary: React.FC<SummaryProps> = ({
    handleBack,
    dataForm
}) => {
    const baseCompetition = CreateCompetition$.parse({
        ...dataForm,
        paymentPlanId: dataForm.plan.id,
        optionsId: dataForm.selectedOptions.map(option => option.id)
    })

    const navigate = useNavigate()

    const onSubmit = async () => {
        createCompetition(baseCompetition).then((competition) => {
            navigate(`/admin/competitions/${competition.eid}`)
        }) 
    }

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
                        <Box>Plan: {dataForm.plan.name}</Box>
                        <Box>Options: {dataForm.selectedOptions.map(option => option.name).join(', ')}</Box>
                    </Box>

                    <Box>
                        <Box>Name: {dataForm.name}</Box>
                        <Box>Date: {dataForm.date?.toLocaleDateString()}</Box>
                        {dataForm.closeDate && <Box>Close Date: {dataForm.closeDate?.toLocaleDateString()}</Box>}
                    </Box>
                </Box>
            </Box>
            
            <Buttons buttons={
                [
                    { label: 'Back', onClick: handleBack },
                    { label: 'Pay', onClick: onSubmit }
                ]
            } />
        </Box>
    )
}
