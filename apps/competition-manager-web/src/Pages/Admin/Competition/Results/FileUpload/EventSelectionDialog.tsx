/**
 * File: apps/competition-manager-web/src/Pages/Admin/Competition/Results/components/EventSelectionDialog.tsx
 *
 * Description: Component for selecting an event when automatic matching fails.
 * Provides a user interface to manually select the appropriate event for result processing.
 */
import { CompetitionEvent } from '@competition-manager/schemas';
import { faSearch } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
    Box,
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogContentText,
    DialogTitle,
    FormControl,
    FormControlLabel,
    InputAdornment,
    Radio,
    RadioGroup,
    TextField,
    Typography,
} from '@mui/material';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';

interface EventSelectionDialogProps {
    /**
     * Whether the dialog is open
     */
    open: boolean;
    /**
     * Available events to select from
     */
    availableEvents: CompetitionEvent[];
    /**
     * Function to call when an event is selected
     */
    onEventSelected: (eventId: string) => void;
    /**
     * Function to call when the selection is canceled
     */
    onCancel: () => void;
}

/**
 * Dialog for selecting an event when automatic matching fails
 * Includes search functionality and event type filtering
 */
export const EventSelectionDialog: React.FC<EventSelectionDialogProps> = ({
    open,
    availableEvents,
    onEventSelected,
    onCancel,
}) => {
    const { t } = useTranslation();
    const [selectedEventId, setSelectedEventId] = useState<string>('');
    const [searchTerm, setSearchTerm] = useState<string>('');
    
    // Filter events based on search term
    const filteredEvents = searchTerm 
        ? availableEvents.filter(event => 
            event.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            event.event.type.toLowerCase().includes(searchTerm.toLowerCase())
        )
        : availableEvents;
    
    // Reset search and selection when dialog opens
    useEffect(() => {
        if (open) {
            setSearchTerm('');
            setSelectedEventId('');
        }
    }, [open]);

    /**
     * Handles event selection change in the radio group
     */
    const handleEventSelectionChange = (
        event: React.ChangeEvent<HTMLInputElement>
    ) => {
        setSelectedEventId(event.target.value);
    };

    /**
     * Handles search input changes
     */
    const handleSearchChange = (
        event: React.ChangeEvent<HTMLInputElement>
    ) => {
        setSearchTerm(event.target.value);
    };

    /**
     * Confirms the selected event and processes the file
     */
    const handleConfirm = () => {
        if (selectedEventId) {
            onEventSelected(selectedEventId);
        }
    };

    /**
     * Handles dialog cancellation
     */
    const handleCancel = () => {
        onCancel();
    };

    return (
        <Dialog 
            open={open} 
            onClose={handleCancel} 
            maxWidth="sm" 
            fullWidth
            aria-labelledby="event-selection-dialog-title"
        >
            <DialogTitle id="event-selection-dialog-title">
                {t('result:selectEvent')}
            </DialogTitle>
            <DialogContent>
                <DialogContentText>
                    {t('result:eventMatchFailed')}
                </DialogContentText>
                
                <TextField
                    margin="normal"
                    fullWidth
                    placeholder={t('result:searchEvents')}
                    value={searchTerm}
                    onChange={handleSearchChange}
                    InputProps={{
                        startAdornment: (
                            <InputAdornment position="start">
                                <FontAwesomeIcon icon={faSearch} />
                            </InputAdornment>
                        ),
                    }}
                />
                
                <Box sx={{ maxHeight: '50vh', overflow: 'auto', mt: 2 }}>
                    <FormControl component="fieldset" sx={{ width: '100%' }}>
                        <RadioGroup
                            aria-label="event selection"
                            name="event-selection"
                            value={selectedEventId}
                            onChange={handleEventSelectionChange}
                        >
                            {filteredEvents.length > 0 ? (
                                filteredEvents.map((event) => (
                                    <FormControlLabel
                                        key={event.eid}
                                        value={event.eid}
                                        control={<Radio />}
                                        label={
                                            <Typography variant="body1">
                                                    {event.name}
                                            </Typography>
                                        }
                                    />
                                ))
                            ) : (
                                <Typography color="text.secondary" sx={{ p: 2 }}>
                                    {t('result:noEventsFound')}
                                </Typography>
                            )}
                        </RadioGroup>
                    </FormControl>
                </Box>
            </DialogContent>
            <DialogActions>
                <Button onClick={handleCancel}>
                    {t('buttons:cancel')}
                </Button>
                <Button
                    onClick={handleConfirm}
                    variant="contained"
                    disabled={!selectedEventId}
                >
                    {t('buttons:confirm')}
                </Button>
            </DialogActions>
        </Dialog>
    );
};
