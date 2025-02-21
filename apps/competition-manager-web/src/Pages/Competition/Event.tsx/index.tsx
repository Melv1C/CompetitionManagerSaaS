import { Avatar, Box, Card, CardContent, CardHeader } from "@mui/material";
import { useTranslation } from "react-i18next";
import { useParams } from "react-router-dom";
import { competitionAtom, inscriptionsAtom } from "../../../GlobalsStates";
import { useAtomValue } from "jotai";
import { Inscriptions } from "./Inscriptions";
import { EventGroup } from "@competition-manager/schemas";
import { NavBar } from "./NavBar";

export const Event = () => {

    const { eventEid } = useParams();
    const { t } = useTranslation();

    const competition = useAtomValue(competitionAtom);
    const allInscriptions = useAtomValue(inscriptionsAtom);
    if (!competition) throw new Error('No competition found');
    if (!allInscriptions) throw new Error('No inscriptions found');

    const event = competition.events.find(e => e.eid === eventEid);
    if (!event) throw new Error('No event found');

    const isMultiEvents = event.event.group === EventGroup.COMBINED || event.parentId;
    const isParentEvent = event.event.group === EventGroup.COMBINED;
    const parentId = isParentEvent ? event.id : event.parentId;

    const inscriptions = allInscriptions.filter(i => i.competitionEvent.id === event.id);

    return (
        <Box 
            sx={{
                display: 'flex',
                flexDirection: 'column',
                gap: 2,
            }}
        >
            <Card>
                <CardHeader 
                    avatar={
                        <Avatar
                            sx={{ 
                                bgcolor: 'primary.main',
                                color: 'primary.contrastText',
                                width: 70,
                                height: 70,
                                fontWeight: 'bold',
                            }}
                        >
                            {event.schedule.toLocaleTimeString('fr', { hour: '2-digit', minute: '2-digit' })}
                        </Avatar>
                    }
                    title={event.name} 
                    titleTypographyProps={{ variant: 'h5' }}
                    subheader={`${inscriptions.length} ${event.place ? `/ ${event.place}` : ''} ${t('glossary:participants')}`}
                    />
                    {isMultiEvents && (
                        <NavBar 
                            baseUrl={`/competitions/${competition.eid}/events`}
                            events={competition.events.filter(e => e.parentId === parentId || e.id === parentId).sort((a, b) => a.schedule.getTime() - b.schedule.getTime())}
                            currentEvent={event}
                        />
                    )}
                <CardContent>
                    <Inscriptions inscriptions={inscriptions} />
                </CardContent>
            </Card>

        </Box>
    )
}
