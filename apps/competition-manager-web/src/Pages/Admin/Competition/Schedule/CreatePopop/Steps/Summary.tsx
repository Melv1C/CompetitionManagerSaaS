import { CompetitionEvent, CreateCompetitionEvent$ } from "@competition-manager/schemas"
import { Box, FormControl, TextField } from "@mui/material"
import { StepperButtons } from "../../../../../../Components"
import { useAtomValue } from "jotai"
import { competitionAtom } from "../../../../../../GlobalsStates"
import { createCompetitionEvent } from "../../../../../../api"

type SummaryProps = {
    handleBack: () => void
    handleNext: () => void
    competitionEvent: CompetitionEvent
}

export const Summary: React.FC<SummaryProps> = ({ 
    handleBack, 
    handleNext, 
    competitionEvent
}) => {

    const competition = useAtomValue(competitionAtom)
    if (!competition) throw new Error('No competition found')

    console.log(competitionEvent)
        
    const createCompetitionEventData = CreateCompetitionEvent$.parse({
        ...competitionEvent,
        eventId: competitionEvent.event.id,
        categoriesId: competitionEvent.categories.map(c => c.id)
    })

    console.log(createCompetitionEventData)
    

    const onCreate = async () => {
        const createdCompetitionEvent = await createCompetitionEvent(competition.eid, createCompetitionEventData)
        console.log(createdCompetitionEvent)
        handleNext()
    }


    return (
        <Box>

            <Box>
                <FormControl>
                    <TextField
                        label="Name"
                        value={competitionEvent.name}
                        disabled
                    />
                </FormControl>

                <FormControl>
                    <TextField
                        label="Event"
                        value={competitionEvent.event.name}
                        disabled
                    />
                </FormControl>

                <FormControl>
                    <TextField
                        label="Schedule"
                        value={competitionEvent.schedule.toString()}
                        disabled
                    />
                </FormControl>

                <FormControl>
                    <TextField
                        label="Place"
                        value={competitionEvent.place?.toString()}
                        disabled
                    />
                </FormControl>

                <FormControl>
                    <TextField
                        label="Cost"
                        value={competitionEvent.cost.toString()}
                        disabled
                    />
                </FormControl>

                <FormControl>
                    <TextField
                        label="Categories"
                        value={competitionEvent.categories.map(c => c.name).join(', ')}
                        disabled
                    />
                </FormControl>

            </Box>

            <StepperButtons
                buttons={[
                    { label: 'Back', onClick: handleBack },
                    { label: 'Create', onClick: onCreate },
                ]}
            />
        </Box>
    )
}
