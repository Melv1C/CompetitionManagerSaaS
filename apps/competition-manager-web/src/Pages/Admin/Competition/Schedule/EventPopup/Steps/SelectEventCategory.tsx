import { Box, Button, Chip, FormControl, IconButton, InputAdornment, InputLabel, Select, TextField } from "@mui/material";
import { getCategories, getEvents } from "../../../../../../api";
import { useQuery } from "react-query";
import { useEffect, useMemo, useState } from "react";
import { Category, Event, EventGroup } from "@competition-manager/schemas";
import { Delete, Loading, StepperButtons } from "../../../../../../Components";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowsRotate } from "@fortawesome/free-solid-svg-icons";
import { EventSelectorDialog } from "./Dialogs/EventSelectorDialog";
import { CategorySelectorDialog } from "./Dialogs/CategorySelectorDialog";
import { useTranslation } from "react-i18next";
import { useAtom } from "jotai";
import { competitionEventDataAtom } from "../../../../../../GlobalsStates";

type SelectEventProps = {
    handleNext: () => void;
};

export const SelectEventCategory: React.FC<SelectEventProps> = ({ 
    handleNext,
}) => {

    const { t } = useTranslation('eventPopup');

    const [competitionEventData, setCompetitionEventData] = useAtom(competitionEventDataAtom);

    const setSelectedEvent = (event: Event) => {
        setCompetitionEventData((prev) => ({
            ...prev,
            event,
            name: event.abbr,
        }));
    };

    const setSelectedCategories = (categories: Category[]) => {
        setCompetitionEventData((prev) => ({
            ...prev,
            categories
        }));
    };

    const addChildrenEvent = () => {
        setCompetitionEventData((prev) => ({
            ...prev,
            children: [
                ...prev.children,
                {
                    event: undefined,
                    name: '',
                    schedule: undefined,
                }
            ]
        }));
    };

    const deleteChildrenEvent = (index: number) => {
        setCompetitionEventData((prev) => ({
            ...prev,
            children: prev.children.filter((_, i) => i !== index)
        }));
    };

    const setChildrenEvent = (index: number, event: Event) => {
        setCompetitionEventData((prev) => ({
            ...prev,
            children: prev.children.map((child, i) => i === index ? { ...child, event, name: event.abbr } : child)
        }));
    };

    const isDisabled = !competitionEventData.event || competitionEventData.categories.length === 0 || competitionEventData.children.some((child) => !child.event);

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
    const [isChildrenEventDialogOpen, setIsChildrenEventDialogOpen] = useState({ index: -1, isOpen: false });
    const [isCategoryDialogOpen, setIsCategoryDialogOpen] = useState(false);
    
    useEffect(() => {
        if (competitionEventData.event?.group !== EventGroup.COMBINED && competitionEventData.children.length > 0) {
            setCompetitionEventData((prev) => ({
                ...prev,
                children: []
            }));
        }
    }, [competitionEventData.event]);
    
    if (isEventsLoading || !events) return <Loading />;
    if (isCategoriesLoading || !categories) return <Loading />;


    return (
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            <TextField
                label={t('selectedEvent')}
                value={competitionEventData.event?.name || ""}
                fullWidth
                slotProps={{
                    input: {
                        readOnly: true,
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
                    onSelect={setSelectedEvent}
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
                    value={competitionEventData.categories}
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
                    initialSelectedCategories={competitionEventData.categories}
                    open={isCategoryDialogOpen}
                    onClose={() => setIsCategoryDialogOpen(false)}
                    onSelect={setSelectedCategories}
                />
            )}

            {competitionEventData.event?.group === EventGroup.COMBINED && (
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                    {competitionEventData.children.map((child, index) => (
                        <Box
                            key={index}
                            sx={{
                                display: 'flex',
                                flexDirection: 'row',
                                gap: 1,
                                padding: "0 1rem",
                            }}
                        >
                            <TextField
                                label={`${t('subEvent')} ${index + 1}`}
                                value={child.event?.abbr || ""}
                                fullWidth
                                slotProps={{
                                    input: {
                                        readOnly: true,
                                        endAdornment: (
                                            <InputAdornment position="end">
                                                <IconButton onClick={() => setIsChildrenEventDialogOpen({ index, isOpen: true })}>
                                                    <FontAwesomeIcon icon={faArrowsRotate} />
                                                </IconButton>
                                            </InputAdornment>
                                        )
                                    }
                                }}
                                onClick={() => setIsChildrenEventDialogOpen({ index, isOpen: true })}
                            />
                            {isChildrenEventDialogOpen.index === index && (
                                <EventSelectorDialog
                                    groupedEvents={groups}
                                    open={isChildrenEventDialogOpen.isOpen}
                                    onClose={() => setIsChildrenEventDialogOpen({ index: -1, isOpen: false })}
                                    onSelect={(event) => {
                                        setChildrenEvent(index, event);
                                        setIsChildrenEventDialogOpen({ index: -1, isOpen: false });
                                    }}
                                />
                            )}
                            <Button 
                                onClick={() => deleteChildrenEvent(index)} 
                                color="error" 
                                sx={{ alignSelf: 'center', padding: 1, minWidth: 0 }}
                            >
                                <Delete size="xl" />
                            </Button>
                        </Box>
                    ))}
                    <Button
                        variant="outlined"
                        onClick={addChildrenEvent}
                        sx={{ alignSelf: 'center', width: 'fit-content' }}
                    >
                        {t('addSubEvent')}
                    </Button>
                </Box>
            )}

            <StepperButtons
                buttons={[
                    { label: t('buttons:next'), onClick: handleNext, disabled: isDisabled }
                ]}
            />

        </Box>
    );
};

