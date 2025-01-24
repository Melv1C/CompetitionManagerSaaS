import { CompetitionEvent, CreateCompetitionEvent$, UpdateCompetitionEvent$ } from "@competition-manager/schemas"
import { Box, FormControl, TextField } from "@mui/material"
import { StepperButtons } from "../../../../../../Components"
import { useAtom } from "jotai"
import { competitionAtom } from "../../../../../../GlobalsStates"
import { createCompetitionEvent, updateCompetitionEvent } from "../../../../../../api"
import { useTranslation } from "react-i18next"

type SummaryProps = {
    handleBack: () => void
    handleNext: () => void
    competitionEvent: CompetitionEvent
}

export const Summary: React.FC<SummaryProps> = ({ 
    handleBack, 
    handleNext, 
    competitionEvent,
}) => {

    const { t } = useTranslation('eventPopup');

    const [competition, setCompetition] = useAtom(competitionAtom)
    if (!competition) throw new Error('No competition found')

    const isCreate = competitionEvent.id === 0;

    const onCreate = async () => {
        const createCompetitionEventData = CreateCompetitionEvent$.parse({
            ...competitionEvent,
            eventId: competitionEvent.event.id,
            categoriesId: competitionEvent.categories.map(c => c.id)
        })
        const createdCompetitionEvent = await createCompetitionEvent(competition.eid, createCompetitionEventData)
        setCompetition({
            ...competition,
            events: [...competition.events, createdCompetitionEvent]
        })
        handleNext()
    }

    const onUpdate = async () => {
        const updateCompetitionEventData = UpdateCompetitionEvent$.parse({
            ...competitionEvent,
            eventId: competitionEvent.event.id,
            categoriesId: competitionEvent.categories.map(c => c.id)
        })
        const updatedCompetitionEvent = await updateCompetitionEvent(competition.eid, competitionEvent.eid, updateCompetitionEventData)
        setCompetition({
            ...competition,
            events: competition.events.map(e => e.eid === updatedCompetitionEvent.eid ? updatedCompetitionEvent : e)
        })
        handleNext()
    }

    return (
        <Box>
            <Box
                sx={{
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '1rem',
                }}
            >
                <FormControl>
                    <TextField
                        label={t('glossary:event')}
                        value={competitionEvent.event.name}
                        slotProps={{
                            input: { readOnly: true }
                        }}
                    />
                </FormControl>

                <FormControl>
                    <TextField
                        label={t('glossary:categories')}
                        value={competitionEvent.categories.map(c => c.abbr).join(', ')}
                        slotProps={{
                            input: { readOnly: true }
                        }}
                    />
                </FormControl>

                <FormControl>
                    <TextField
                        label={t('labels:schedule')}
                        value={competitionEvent.schedule.toLocaleDateString() + ' ' + competitionEvent.schedule.toLocaleTimeString('fr', { hour: '2-digit', minute: '2-digit' })}
                        slotProps={{
                            input: { readOnly: true }
                        }}
                    />
                </FormControl>

                <FormControl>
                    <TextField
                        label={t('labels:name')}
                        value={competitionEvent.name}
                        slotProps={{
                            input: { readOnly: true }
                        }}
                    />
                </FormControl>


                <FormControl>
                    <TextField
                        label={t('glossary:place')}
                        value={competitionEvent.place ? competitionEvent.place : 'No limit'}
                        slotProps={{
                            input: { readOnly: true }
                        }}
                    />
                </FormControl>

                <FormControl>
                    <TextField
                        label={t('glossary:price')}
                        value={competitionEvent.cost === 0 ? t('glossary:free') : competitionEvent.cost.toString()}
                        slotProps={{
                            input: { readOnly: true }
                        }}
                    />
                </FormControl>
            </Box>

            <StepperButtons
                buttons={[
                    { label: t('buttons:previous'), onClick: handleBack },
                    isCreate ? { label: t('buttons:create'), onClick: onCreate } : { label: 'Update', onClick: onUpdate },
                ]}
            />
        </Box>
    )
}
