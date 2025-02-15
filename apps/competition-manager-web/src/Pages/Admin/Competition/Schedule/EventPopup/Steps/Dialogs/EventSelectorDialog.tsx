import React, { useState } from 'react';
import { Dialog, DialogTitle, Tabs, Tab, List, Box, ListItemButton } from '@mui/material';
import { Event } from '@competition-manager/schemas';
import { useTranslation } from 'react-i18next';

interface GroupedEvents {
    label: string;
    items: Event[];
}

interface EventSelectorDialogProps {
    groupedEvents: GroupedEvents[];
    open: boolean;
    onClose: () => void;
    onSelect: (selectedEvent: Event) => void; // Callback pour envoyer l'épreuve sélectionnée
}

export const EventSelectorDialog: React.FC<EventSelectorDialogProps> = ({
    groupedEvents,
    open,
    onClose,
    onSelect,
}) => {

    const { t } = useTranslation('eventPopup');

    const [selectedGroup, setSelectedGroup] = useState(0);

    const filteredEvents = groupedEvents[selectedGroup]?.items;

    return (
        <Dialog 
            open={open} 
            onClose={onClose} 
            fullWidth 
            maxWidth="sm"
        >
            <DialogTitle>{t('selectEvent')}</DialogTitle>
            <Box p={2}>
                <Tabs value={selectedGroup} onChange={(_, newValue) => setSelectedGroup(newValue)} variant="scrollable">
                    {groupedEvents.sort((a, b) => a.label.localeCompare(b.label)).map((group, index) => (
                        <Tab key={index} label={group.label} />
                    ))}
                </Tabs>
                <List sx={{ height: 300, overflow: 'auto' }}>
                    {filteredEvents?.sort((a, b) => a.name.localeCompare(b.name)).map((event) => (
                        <ListItemButton
                            key={event.id}
                            onClick={() => {
                                onSelect(event); // Appelle la fonction onSelect avec l'épreuve sélectionnée
                                onClose(); // Ferme le Dialog
                            }}
                        >
                            {event.name}
                        </ListItemButton>
                    ))}
                </List>
            </Box>
        </Dialog>
    );
};
