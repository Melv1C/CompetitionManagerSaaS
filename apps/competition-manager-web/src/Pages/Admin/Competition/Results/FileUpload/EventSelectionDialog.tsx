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
    LinearProgress,
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
     * Array of round names to select events for
     */
    roundNames?: string[];
    /**
     * Function to call when events are selected for each round
     */
    onEventsSelected: (eventSelections: Record<string, string>) => void;
    /**
     * Function to call when the selection is canceled
     */
    onCancel: () => void;
}

/**
 * Dialog for selecting events when automatic matching fails
 * Supports selecting events for multiple rounds one by one
 */
export const EventSelectionDialog: React.FC<EventSelectionDialogProps> = ({
    open,
    availableEvents,
    roundNames = [],
    onEventsSelected,
    onCancel,
}) => {
    const { t } = useTranslation();
    const [selectedEvents, setSelectedEvents] = useState<
        Record<string, string>
    >({});
    const [searchTerm, setSearchTerm] = useState<string>('');
    const [currentRoundIndex, setCurrentRoundIndex] = useState(0);

    const singleRoundMode = roundNames.length <= 1;
    // Default round name if none provided
    const effectiveRoundNames =
        roundNames.length === 0 ? ['default'] : roundNames;

    // Get current round name
    const currentRoundName = effectiveRoundNames[currentRoundIndex];

    // Filter events based on search term
    const filteredEvents = searchTerm
        ? availableEvents.filter(
              (event) =>
                  event.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                  event.event.type
                      .toLowerCase()
                      .includes(searchTerm.toLowerCase())
          )
        : availableEvents;

    // Reset search and selection when dialog opens
    useEffect(() => {
        if (open) {
            setSearchTerm('');
            setSelectedEvents({});
            setCurrentRoundIndex(0);
        }
    }, [open]);

    /**
     * Handles event selection change in the radio group
     */
    const handleEventSelectionChange = (
        event: React.ChangeEvent<HTMLInputElement>
    ) => {
        const eventEid = event.target.value;
        setSelectedEvents((prev) => ({
            ...prev,
            [currentRoundName]: eventEid,
        }));
    };

    /**
     * Handles search input changes
     */
    const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setSearchTerm(event.target.value);
    };

    /**
     * Handles the next round button click
     */
    const handleNextRound = () => {
        if (currentRoundIndex < effectiveRoundNames.length - 1) {
            setCurrentRoundIndex((prev) => prev + 1);
            setSearchTerm(''); // Reset search for the next round
        } else {
            // We're done with all rounds, submit the selections
            submitSelections();
        }
    };

    /**
     * Submit all selections to the parent component
     */
    const submitSelections = () => {
        // For single round mode with no specific round name, use the default format
        if (singleRoundMode && effectiveRoundNames[0] === 'default') {
            onEventsSelected({ event: selectedEvents['default'] });
        } else {
            onEventsSelected(selectedEvents);
        }
    };

    /**
     * Calculates the progress percentage through the rounds
     */
    const progressPercentage =
        ((currentRoundIndex + 1) / effectiveRoundNames.length) * 100;

    /**
     * Determine the text for the next/confirm button
     */
    const getNextButtonText = () => {
        if (currentRoundIndex < effectiveRoundNames.length - 1) {
            return t('buttons:next');
        }
        return t('buttons:confirm');
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
            {' '}
            <DialogTitle id="event-selection-dialog-title">
                {t('result:selectEvent')}
            </DialogTitle>
            {!singleRoundMode && (
                <>
                    <LinearProgress
                        variant="determinate"
                        value={progressPercentage}
                        sx={{ mx: 3 }}
                    />
                    <Typography
                        variant="caption"
                        align="center"
                        sx={{ display: 'block', mt: 1 }}
                    >
                        {t('result:roundProgress', {
                            current: currentRoundIndex + 1,
                            total: effectiveRoundNames.length,
                        })}
                    </Typography>
                </>
            )}
            <DialogContent>
                {' '}
                <DialogContentText sx={{ mb: 2 }}>
                    {t('result:eventMatchFailed')}
                </DialogContentText>
                {!singleRoundMode && (
                    <Box
                        sx={{
                            mb: 2,
                            p: 1,
                            bgcolor: 'background.default',
                            borderRadius: 1,
                        }}
                    >
                        <Typography variant="subtitle2" color="primary">
                            Name found in the xml : {currentRoundName}  {/*to translate*/}
                        </Typography>
                    </Box>
                )}
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
                            aria-label={`event selection for ${currentRoundName}`}
                            name={`event-selection-${currentRoundName}`}
                            value={selectedEvents[currentRoundName] || ''}
                            onChange={handleEventSelectionChange}
                        >
                            {filteredEvents.length > 0 ? (
                                filteredEvents.map((event) => (
                                    <FormControlLabel
                                        key={`${currentRoundName}-${event.eid}`}
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
                                <Typography
                                    color="text.secondary"
                                    sx={{ p: 2 }}
                                >
                                    {t('result:noEventsFound')}
                                </Typography>
                            )}
                        </RadioGroup>
                    </FormControl>
                </Box>
            </DialogContent>
            <DialogActions>
                <Button onClick={handleCancel}>{t('buttons:cancel')}</Button>
                <Button
                    onClick={handleNextRound}
                    variant="contained"
                    disabled={!selectedEvents[currentRoundName]}
                >
                    {getNextButtonText()}
                </Button>
            </DialogActions>
        </Dialog>
    );
};
