import { useAtomValue } from "jotai";
import { competitionAtom } from "../../../GlobalsStates";
import { Box, Card, Chip, List, ListItem, ListItemIcon, ListItemText, Typography } from "@mui/material";
import { Category, Event, Gender } from "@competition-manager/schemas";
import { useMemo } from "react";

const getFullBaseCategory = (category: Category) => {
    return `${category.abbrBaseCategory} ${category.gender}`;	
}

export const Events = () => {
            
    const competition = useAtomValue(competitionAtom);
    if (!competition) throw new Error('No competition found');

    const allBaseCategories = useMemo(() => competition.events.reduce((acc, event) => {
        event.categories.forEach(category => {
            if (!acc.map(c => getFullBaseCategory(c)).includes(getFullBaseCategory(category))) {
                acc.push(category);
            }
        });
        return acc;
    }, [] as Category[]).sort((a, b) => a.order - b.order), [competition.events]);

    const eventsByCategory = useMemo(() => competition.events.filter(e => !e.parentId).reduce((acc, event) => {
        event.categories.forEach(category => {
            if (!acc[getFullBaseCategory(category)]) {
                acc[getFullBaseCategory(category)] = [];
            }
            if (!acc[getFullBaseCategory(category)].map(e => e.abbr).includes(event.event.abbr)) {
                acc[getFullBaseCategory(category)].push(event.event);
            }
        });
        return acc;
    }, {} as Record<Category['abbr'], Event[]>), [competition.events]);

    return (
        <>
            {[Gender.F, Gender.M].map(gender => {
                if (allBaseCategories.filter(c => c.gender === gender).length > 0) {
                    return (
                        <Card 
                            sx={{ 
                                minWidth: 250,
                                maxWidth: 300,
                                height: 'fit-content',
                            }}
                        >
                            <List>
                                {allBaseCategories.filter(c => c.gender === gender).map(category => (
                                    <ListItem
                                        key={category.id}
                                    >
                                        <ListItemIcon sx={{ marginRight: 2 }}>
                                            <Typography color="primary.main" fontWeight="bold">
                                                {getFullBaseCategory(category)}
                                            </Typography>
                                        </ListItemIcon>
                                        <ListItemText
                                            primary={(
                                                <Box
                                                    sx={{
                                                        display: 'flex',
                                                        flexWrap: 'wrap',
                                                        justifyContent: 'center',
                                                        gap: 1
                                                    }}
                                                >
                                                    {eventsByCategory[getFullBaseCategory(category)]?.map(event => (
                                                        <Chip
                                                            key={event.id}
                                                            label={event.abbr}
                                                        />
                                                    ))}
                                                </Box>
                                            )}
                                        />
                                    </ListItem>
                                ))}
                            </List>
                        </Card>
                    );
                }
                return null;
            })}
        </>
    )
}
