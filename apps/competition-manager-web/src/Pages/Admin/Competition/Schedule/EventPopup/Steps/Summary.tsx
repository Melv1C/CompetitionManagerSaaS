import { CreateCompetitionEvent$, UpdateCompetitionEvent$ } from "@competition-manager/schemas"
import { Box, FormControl, TextField } from "@mui/material"
import { StepperButtons } from "../../../../../../Components"
import { useAtom, useAtomValue } from "jotai"
import { competitionAtom, competitionEventDataAtom } from "../../../../../../GlobalsStates"
import { createCompetitionEvent, updateCompetitionEvent } from "../../../../../../api"
import { useTranslation } from "react-i18next"

type SummaryProps = {
    handleBack: () => void
    handleNext: () => void
}

export const Summary: React.FC<SummaryProps> = ({ 
    handleBack, 
    handleNext,
}) => {

    const { t } = useTranslation('eventPopup');

    const [competition, setCompetition] = useAtom(competitionAtom)
    if (!competition) throw new Error('No competition found')

    const competitionEventData = useAtomValue(competitionEventDataAtom);

    const isCreate = !competitionEventData.eid

    if (!competitionEventData.event) throw new Error('No event found')
    if (!competitionEventData.schedule) throw new Error('No schedule found')

    const onCreate = async () => {
        const createCompetitionEventData = CreateCompetitionEvent$.parse({
            ...competitionEventData,
            eventId: competitionEventData.event!.id,
            categoriesId: competitionEventData.categories.map(c => c.id)
        })
        const createdCompetitionEvent = await createCompetitionEvent(competition.eid, createCompetitionEventData)

        const createdChildren = await Promise.all(competitionEventData.children.map(async (child) => {
            const createSubCompetitionEventData = CreateCompetitionEvent$.parse({
                ...child,
                eventId: child.event!.id,
                place: competitionEventData.place,
                cost: 0,
                categoriesId: competitionEventData.categories.map(c => c.id),
                parentEid: createdCompetitionEvent.eid
            })
            return await createCompetitionEvent(competition.eid, createSubCompetitionEventData)
        }));

        setCompetition({
            ...competition,
            events: [...competition.events, createdCompetitionEvent, ...createdChildren]
        })
        handleNext()
    }

    const onUpdate = async () => {
        const updateCompetitionEventData = UpdateCompetitionEvent$.parse({
            ...competitionEventData,
            eventId: competitionEventData.event!.id,
            categoriesId: competitionEventData.categories.map(c => c.id)
        })
        const updatedCompetitionEvent = await updateCompetitionEvent(competition.eid, competitionEventData.eid!, updateCompetitionEventData)

        const updatedChildren = await Promise.all(competitionEventData.children.map(async (child) => {
            const updateSubCompetitionEventData = UpdateCompetitionEvent$.parse({
                ...child,
                eventId: child.event!.id,
                place: competitionEventData.place,
                cost: 0,
                categoriesId: competitionEventData.categories.map(c => c.id),
                parentEid: updatedCompetitionEvent.eid
            })
            return await updateCompetitionEvent(competition.eid, child.eid!, updateSubCompetitionEventData)
        }));

        const updatedEvents = [
            ...competition.events.filter(e => e.eid !== updatedCompetitionEvent.eid).filter(e => !updatedChildren.map(c => c.eid).includes(e.eid)),
            updatedCompetitionEvent,
            ...updatedChildren
        ]

        setCompetition({
            ...competition,
            events: updatedEvents
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
                        value={competitionEventData.event.name}
                        slotProps={{
                            input: { readOnly: true }
                        }}
                    />
                </FormControl>

                <FormControl>
                    <TextField
                        label={t('glossary:categories')}
                        value={competitionEventData.categories.map(c => c.abbr).join(', ')}
                        slotProps={{
                            input: { readOnly: true }
                        }}
                    />
                </FormControl>

                <FormControl>
                    <TextField
                        label={t('labels:schedule')}
                        value={competitionEventData.schedule.toLocaleDateString('fr') + ' ' + competitionEventData.schedule.toLocaleTimeString('fr', { hour: '2-digit', minute: '2-digit' })}
                        slotProps={{
                            input: { readOnly: true }
                        }}
                    />
                </FormControl>

                <FormControl>
                    <TextField
                        label={t('labels:name')}
                        value={competitionEventData.name}
                        slotProps={{
                            input: { readOnly: true }
                        }}
                    />
                </FormControl>


                <FormControl>
                    <TextField
                        label={t('glossary:place')}
                        value={competitionEventData.place ? competitionEventData.place : 'No limit'}
                        slotProps={{
                            input: { readOnly: true }
                        }}
                    />
                </FormControl>

                <FormControl>
                    <TextField
                        label={t('glossary:price')}
                        value={competitionEventData.cost === 0 ? t('glossary:free') : competitionEventData.cost.toString()}
                        slotProps={{
                            input: { readOnly: true }
                        }}
                    />
                </FormControl>
            </Box>

            <StepperButtons
                buttons={[
                    { label: t('buttons:previous'), onClick: handleBack },
                    isCreate ? { label: t('buttons:create'), onClick: onCreate } : { label: t('buttons:modify'), onClick: onUpdate },
                ]}
            />
        </Box>
    )
}
