import { Box, Chip, FormControl, IconButton, InputAdornment, InputLabel, List, Select, TextField } from "@mui/material";
import { getCategories, getEvents } from "../../../../../../api";
import { useQuery } from "react-query";
import { useMemo, useState } from "react";
import { Category, Event } from "@competition-manager/schemas";
import { Loading, StepperButtons } from "../../../../../../Components";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowsRotate } from "@fortawesome/free-solid-svg-icons";
import { EventSelectorDialog } from "./Dialogs/EventSelectorDialog";
import { CategorySelectorDialog } from "./Dialogs/CategorySelectorDialog";
import { useTranslation } from "react-i18next";

type SelectEventProps = {
    handleNext: () => void;
    selectedEvent: Event | undefined;
    onSelectedEvent: (event: Event) => void;
    selectedCategories: Category[];
    onSelectedCategories: (categories: Category[]) => void;
};

export const SelectEventCategory: React.FC<SelectEventProps> = ({ 
    handleNext,
    selectedEvent,
    onSelectedEvent,
    selectedCategories,
    onSelectedCategories
}) => {

    const { t } = useTranslation('eventPopup');

    const { data: events, isLoading: isEventsLoading, isError: isEventsError } = useQuery(['events'], getEvents);
    const { data: categories, isLoading: isCategoriesLoading, isError: isCategoriesError } = useQuery(['categories'], getCategories);
    
    if (isEventsError) throw new Error('Error fetching events');
    if (isCategoriesError) throw new Error('Error fetching categories');
    
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
    
    const [isEventDialogOpen, setIsEventDialogOpen] = useState(false);
    const [isCategoryDialogOpen, setIsCategoryDialogOpen] = useState(false);
    
    if (isEventsLoading || !events) return <Loading />;
    if (isCategoriesLoading || !categories) return <Loading />;

    return (
        <Box>
            {/* TextField immuable avec icône */}

            <List
                sx={{
                    display: 'flex',
                    flexWrap: 'wrap',
                    gap: 1,
                    p: 0,
                    m: 0
                }}
            >
                <TextField
                    // label="Épreuve sélectionnée"
                    label={t('selectedEvent')}
                    value={selectedEvent?.name || ""}
                    fullWidth
                    slotProps={{
                        input: {
                            readOnly: true, // Rend le champ non modifiable
                            endAdornment: (
                                <InputAdornment position="end">
                                    <IconButton onClick={() => setIsEventDialogOpen(true)}>
                                        <FontAwesomeIcon icon={faArrowsRotate} />
                                    </IconButton>
                                </InputAdornment>
                            )
                        }
                    }}
                    onClick={() => setIsEventDialogOpen(true)}
                />
                {/* Dialog de sélection */}
                {isEventDialogOpen && (
                    <EventSelectorDialog
                        groupedEvents={groups}
                        open={isEventDialogOpen}
                        onClose={() => setIsEventDialogOpen(false)}
                        onSelect={onSelectedEvent}
                    />
                )}

                <FormControl fullWidth>
                    <InputLabel id="categoriesSelectLabel">
                        {t('glossary:categories')}
                    </InputLabel>
                    <Select
                        id="categoriesSelect"
                        labelId="categoriesSelectLabel"
                        label={t('glossary:categories')}
                        multiple
                        value={selectedCategories}
                        onClick={() => setIsCategoryDialogOpen(true)}
                        renderValue={(selected) => (
                            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                                {(selected as Category[]).map((category) => (
                                    <Chip key={category.id} label={category.abbr} />
                                ))}
                            </Box>
                        )}
                        slotProps={{
                            input: {
                                readOnly: true,
                            }
                        }}
                        IconComponent={() => (
                            <InputAdornment position="end">
                                <IconButton onClick={() => setIsCategoryDialogOpen(true)}>
                                    <FontAwesomeIcon icon={faArrowsRotate} />
                                </IconButton>
                            </InputAdornment>
                        )}
                        sx={{
                            paddingRight: "14px"
                        }}
                    />
                </FormControl>
                
                {isCategoryDialogOpen && (
                    <CategorySelectorDialog
                        categories={categories}
                        initialSelectedCategories={selectedCategories}
                        open={isCategoryDialogOpen}
                        onClose={() => setIsCategoryDialogOpen(false)}
                        onSelect={onSelectedCategories}
                    />
                )}
            </List>

            <StepperButtons
                buttons={[
                    { label: t('buttons:next'), onClick: handleNext, disabled: !selectedEvent || selectedCategories.length === 0 }
                ]}
            />

        </Box>
    );
};

