import { competitionAtom } from '@/GlobalsStates';
import { CompetitionEvent, EventType, Id } from '@competition-manager/schemas';
import { faPlus, faTimes } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
    Box,
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    IconButton,
    List,
    ListItemButton,
    ListItemText,
    Paper,
    Tab,
    Tabs,
    Typography,
} from '@mui/material';
import { useAtomValue } from 'jotai';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useLocalStorage } from 'usehooks-ts';
import { DistanceEncode } from './Distance';
import { HeightEncode } from './Height';

/**
 * TabPanel component for displaying tab content
 */
interface TabPanelProps {
    children?: React.ReactNode;
    index: number;
    value: number;
}

const TabPanel = (props: TabPanelProps) => {
    const { children, value, index, ...other } = props;

    return (
        <Box
            role="tabpanel"
            hidden={value !== index}
            id={`event-tabpanel-${index}`}
            aria-labelledby={`event-tab-${index}`}
            {...other}
            style={{ padding: '16px 0' }}
        >
            {value === index && <Box>{children}</Box>}
        </Box>
    );
};

export const Encoding = () => {
    const { t } = useTranslation();
    const competition = useAtomValue(competitionAtom);
    if (!competition) throw new Error('No competition data found');

    // Use local storage for active tab and event tabs with competition-specific keys
    const [activeTab, setActiveTab] = useLocalStorage<number>(
        `encoding-active-tab-${competition.id}`,
        0
    );
    const [openEventDialog, setOpenEventDialog] = useState(false);

    // Store event IDs in local storage instead of full objects to avoid serialization issues
    const [eventTabIds, setEventTabIds] = useLocalStorage<Id[]>(
        `encoding-event-tabs-${competition.id}`,
        []
    );

    // Reconstruct full event objects from IDs
    const [eventTabs, setEventTabs] = useState<CompetitionEvent[]>([]);

    // Reconstruct event tabs from IDs when competition data is available
    useEffect(() => {
        if (competition && eventTabIds.length > 0) {
            const tabs = eventTabIds
                .map((id) =>
                    competition.events.find((event) => event.id === id)
                )
                .filter(
                    (event): event is CompetitionEvent => event !== undefined
                );

            setEventTabs(tabs);

            // Ensure active tab is valid
            if (activeTab >= tabs.length) {
                setActiveTab(Math.max(0, tabs.length - 1));
            }
        } else {
            setEventTabs([]);
        }
    }, [competition, eventTabIds, activeTab, setActiveTab]);

    // Handle tab change
    const handleTabChange = (
        _event: React.SyntheticEvent,
        newValue: number
    ) => {
        if (newValue === eventTabs.length) return;
        setActiveTab(newValue);
    };

    // Handle adding a new event tab
    const handleAddEventTab = (event: CompetitionEvent) => {
        const newEventTabs = [...eventTabs, event];
        setEventTabs(newEventTabs);
        setEventTabIds(newEventTabs.map((e) => e.id));
        setActiveTab(newEventTabs.length - 1);
        setOpenEventDialog(false);
    };

    // Handle removing an event tab
    const handleRemoveEventTab = (index: number, event: React.MouseEvent) => {
        event.stopPropagation();
        const newEventTabs = [...eventTabs];
        newEventTabs.splice(index, 1);
        setEventTabs(newEventTabs);
        setEventTabIds(newEventTabs.map((e) => e.id));

        // Adjust the active tab if necessary
        if (index <= activeTab) {
            setActiveTab(Math.max(0, activeTab - 1));
        }
    };

    // Render appropriate encoding component based on event type
    const renderEncodingComponent = (event: CompetitionEvent) => {
        // Get the event type from the base event
        const eventType = event.event?.type;

        switch (eventType) {
            case EventType.HEIGHT:
                return <HeightEncode event={event} />;
            case EventType.DISTANCE:
                return <DistanceEncode event={event} />;
            case EventType.TIME:
                return (
                    <Box sx={{ p: 3, textAlign: 'center' }}>
                        <Typography variant="body1" color="text.secondary">
                            {t('result:timeEncodingNotImplemented')}
                        </Typography>
                    </Box>
                );
            case EventType.POINTS:
                return (
                    <Box sx={{ p: 3, textAlign: 'center' }}>
                        <Typography variant="body1" color="text.secondary">
                            {t('result:pointsEncodingNotImplemented')}
                        </Typography>
                    </Box>
                );
            default:
                return (
                    <Box sx={{ p: 3, textAlign: 'center' }}>
                        <Typography variant="body1" color="text.secondary">
                            {t('result:encodingNotAvailable')}
                        </Typography>
                    </Box>
                );
        }
    };

    {
        /* Events tabs for result encoding */
    }
    return (
        <>
            <Paper elevation={1} sx={{ p: 2 }}>
                <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
                    <Tabs
                        value={activeTab}
                        onChange={handleTabChange}
                        variant="scrollable"
                        scrollButtons="auto"
                        aria-label="event tabs"
                    >
                        {eventTabs.map((event, index) => (
                            <Tab
                                key={event.id}
                                label={
                                    <Box
                                        sx={{
                                            display: 'flex',
                                            alignItems: 'center',
                                        }}
                                    >
                                        {event.name}
                                        <IconButton
                                            size="small"
                                            onClick={(e) =>
                                                handleRemoveEventTab(index, e)
                                            }
                                            sx={{ ml: 1 }}
                                        >
                                            <FontAwesomeIcon
                                                icon={faTimes}
                                                size="xs"
                                                color="red"
                                            />
                                        </IconButton>
                                    </Box>
                                }
                                id={`event-tab-${index}`}
                                aria-controls={`event-tabpanel-${index}`}
                            />
                        ))}
                        <Tab
                            icon={<FontAwesomeIcon icon={faPlus} />}
                            onClick={() => setOpenEventDialog(true)}
                        />
                    </Tabs>
                </Box>

                {eventTabs.length === 0 ? (
                    <Box sx={{ p: 3, textAlign: 'center' }}>
                        <Typography variant="body1" color="text.secondary">
                            {t('result:noEventsSelected')}
                        </Typography>
                        <Button
                            startIcon={<FontAwesomeIcon icon={faPlus} />}
                            variant="contained"
                            onClick={() => setOpenEventDialog(true)}
                            sx={{ mt: 2 }}
                        >
                            {t('result:addEvent')}
                        </Button>
                    </Box>
                ) : (
                    eventTabs.map((event, index) => (
                        <TabPanel
                            key={event.id}
                            value={activeTab}
                            index={index}
                        >
                            <Paper
                                elevation={0}
                                sx={{ p: 2, bgcolor: 'background.default' }}
                            >
                                {renderEncodingComponent(event)}
                            </Paper>
                        </TabPanel>
                    ))
                )}
            </Paper>
            <Dialog
                open={openEventDialog}
                onClose={() => setOpenEventDialog(false)}
                maxWidth="sm"
                fullWidth
            >
                <DialogTitle>{t('result:selectEvent')}</DialogTitle>
                <DialogContent>
                    <List>
                        {competition.events
                            .sort(
                                (a, b) =>
                                    a.schedule.getTime() - b.schedule.getTime()
                            )
                            .map((event) => (
                                <ListItemButton
                                    key={event.id}
                                    onClick={() => handleAddEventTab(event)}
                                    disabled={eventTabs.some(
                                        (e) => e.id === event.id
                                    )}
                                >
                                    <ListItemText
                                        primary={event.name}
                                        secondary={event.schedule.toLocaleTimeString(
                                            'fr',
                                            {
                                                hour: '2-digit',
                                                minute: '2-digit',
                                            }
                                        )}
                                    />
                                </ListItemButton>
                            ))}
                    </List>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setOpenEventDialog(false)}>
                        {t('buttons:cancel')}
                    </Button>
                </DialogActions>
            </Dialog>
        </>
    );
};
