import { Box, IconButton, InputAdornment, TextField } from "@mui/material";
import { getEvents } from "../../../../../api";
import { useQuery } from "react-query";
import { useMemo, useState } from "react";
import { Event } from "@competition-manager/schemas";
import { Loading, StepperButtons } from "../../../../../Components";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowsRotate } from "@fortawesome/free-solid-svg-icons";
import { EventSelectorDialog } from "./EventSelectorDialog";

type SelectEventProps = {
    handleNext: () => void;
    selectedEvent: Event | undefined;
    onSelect: (event: Event) => void;
};

export const SelectEvent: React.FC<SelectEventProps> = ({ 
    handleNext,
    selectedEvent,
    onSelect
}) => {
    const { data: events, isLoading, isError } = useQuery(['events'], getEvents);
    
    if (isError) throw new Error('Error fetching events');
    
    const groups = useMemo(() => {
        if (!events) return [];
        const groupsMap = events.reduce((acc, event) => {
            if (!acc[event.group]) {
                acc[event.group] = [];
            }
            acc[event.group].push(event);
            return acc;
        }, {} as Record<string, Event[]>);
        
        return Object.entries(groupsMap).map(([label, items]) => ({
            label,
            items
        }));
    }, [events]);
    
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    
    if (isLoading || !events) return <Loading />;

    return (
        <Box>
            {/* TextField immuable avec icône */}
            <TextField
                label="Épreuve sélectionnée"
                value={selectedEvent?.name || ""}
                placeholder="Aucune épreuve sélectionnée"
                fullWidth
                slotProps={{
                    input: {
                        readOnly: true, // Rend le champ non modifiable
                        endAdornment: (
                            <InputAdornment position="end">
                                <IconButton onClick={() => setIsDialogOpen(true)}>
                                    <FontAwesomeIcon icon={faArrowsRotate} />
                                </IconButton>
                            </InputAdornment>
                        )
                    }
                }}
                onClick={() => setIsDialogOpen(true)}
            />
            {/* Dialog de sélection */}
            {isDialogOpen && (
                <EventSelectorDialog
                    groupedEvents={groups}
                    open={isDialogOpen}
                    onClose={() => setIsDialogOpen(false)}
                    onSelect={onSelect}
                />
            )}

            <StepperButtons
                buttons={[
                    { label: 'Next', onClick: handleNext, disabled: !selectedEvent }
                ]}
            />

        </Box>
    );
};
