import { Time } from '@/Components';
import {
    competitionAtom,
    inscriptionsAtom,
    resultsAtom,
} from '@/GlobalsStates';
import { EventGroup } from '@competition-manager/schemas';
import {
    Box,
    Card,
    CardContent,
    CardHeader,
    Divider,
    Tab,
    Tabs,
} from '@mui/material';
import { useAtomValue } from 'jotai';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useParams } from 'react-router-dom';
import { Inscriptions } from './Inscriptions';
import { NavBar } from './NavBar';
import { Results } from './Results';

export const Event = () => {
    const { eventEid } = useParams();
    const { t } = useTranslation();
    const [tab, setTab] = useState<'inscriptions' | 'results'>('inscriptions');

    const competition = useAtomValue(competitionAtom);
    const allInscriptions = useAtomValue(inscriptionsAtom);
    const allResults = useAtomValue(resultsAtom);
    if (!competition) throw new Error('No competition found');
    if (!allInscriptions) throw new Error('No inscriptions found');
    if (!allResults) throw new Error('No results found');

    const event = competition.events.find((e) => e.eid === eventEid);
    if (!event) throw new Error('No event found');

    const isMultiEvents =
        event.event.group === EventGroup.COMBINED || event.parentId;
    const isParentEvent = event.event.group === EventGroup.COMBINED;
    const parentId = isParentEvent ? event.id : event.parentId;

    const inscriptions = allInscriptions.filter(
        (i) => i.competitionEvent.id === event.id
    );

    const handleTabChange = (
        _: React.SyntheticEvent,
        newValue: 'inscriptions' | 'results'
    ) => {
        setTab(newValue);
    };

    useEffect(() => {
        if (allResults.filter((r) => r.competitionEvent.id === event.id).length > 0) {
            setTab('results');
        }
    }, [allResults, event.id]);

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
                    avatar={<Time date={event.schedule} size="lg" />}
                    title={event.name}
                    slotProps={{ title: { variant: 'h5' } }}
                    subheader={`${inscriptions.length} ${
                        event.place ? `/ ${event.place}` : ''
                    } ${t('glossary:participants')}`}
                />
                {isMultiEvents && (
                    <NavBar
                        baseUrl={`/competitions/${competition.eid}/events`}
                        events={competition.events
                            .filter(
                                (e) =>
                                    e.parentId === parentId || e.id === parentId
                            )
                            .sort(
                                (a, b) =>
                                    a.schedule.getTime() - b.schedule.getTime()
                            )}
                        currentEvent={event}
                    />
                )}

                <Tabs value={tab} onChange={handleTabChange} centered>
                    <Tab label={t('Inscriptions')} value="inscriptions" />
                    <Tab label={t('Results')} value="results" />
                </Tabs>

                <Divider />

                <CardContent>
                    {tab === 'inscriptions' ? (
                        <Inscriptions inscriptions={inscriptions} />
                    ) : (
                        <Results
                            eventId={event.eid}
                            eventType={event.event.type}
                        />
                    )}
                </CardContent>
            </Card>
        </Box>
    );
};
