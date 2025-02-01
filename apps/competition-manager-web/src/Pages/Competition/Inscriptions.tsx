import { Badge, IconButton, Link, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from "@mui/material";
import { useAtomValue } from "jotai";
import { useTranslation } from "react-i18next";
import { competitionAtom, inscriptionsAtom } from "../../GlobalsStates";
import { useMemo, useState } from "react";
import { getCategoryAbbr } from "@competition-manager/utils";
import { Filter, FilterMenu } from "../../Components";
import { useNavigate } from "react-router-dom";

export const Inscriptions = () => {

    const { t } = useTranslation();
    const navigate = useNavigate();
    
    const competition = useAtomValue(competitionAtom);
    const inscriptions = useAtomValue(inscriptionsAtom);
    if (!competition) throw new Error('No competition found');
    if (!inscriptions) throw new Error('No inscriptions found');

    const allCategories = useMemo(() => [...new Set(inscriptions.map(i => getCategoryAbbr(i.athlete.birthdate, i.athlete.gender, competition.date)))], [inscriptions, competition.date]);
    const allClubs = useMemo(() => [...new Set(inscriptions.map(i => i.club.abbr))], [inscriptions]);
    const allEvents = useMemo(() => [...new Set(inscriptions.map(i => i.competitionEvent.name))], [inscriptions]);

    const [categoryFilter, setCategoryFilter] = useState(allCategories);
    const [clubfilter, setClubFilter] = useState(allClubs);
    const [eventFilter, setEventFilter] = useState(allEvents);

    const [isCategoryFilterMenuOpen, setIsCategoryFilterMenuOpen] = useState(false);
    const [isClubFilterMenuOpen, setIsClubFilterMenuOpen] = useState(false);
    const [isEventFilterMenuOpen, setIsEventFilterMenuOpen] = useState(false); 

    const filteredInscriptions = useMemo(() => inscriptions.sort((a, b) => b.date.getTime() - a.date.getTime()).filter(i => {
        return categoryFilter.includes(getCategoryAbbr(i.athlete.birthdate, i.athlete.gender, competition.date))
            && clubfilter.includes(i.club.abbr)
            && eventFilter.includes(i.competitionEvent.name);
    }), [inscriptions, categoryFilter, clubfilter, eventFilter, competition.date]);

    return (
        <Paper sx={{ width: 'max-content', margin: 'auto', maxWidth: '100%' }}>
            <TableContainer>
                <Table size="small">
                    <TableHead sx={{ backgroundColor: 'rgba(0, 0, 0, 0.04)' }}>
                        <TableRow>
                            <TableCell width={50} align="center">
                                {t('glossary:bib')}
                            </TableCell>
                            <TableCell sx={{ minWidth: 150 }}>
                                {t('glossary:athlete')}
                            </TableCell>
                            <TableCell width={100} sx={{ minWidth: 100 }}>
                                {t('glossary:category')}
                                <Badge variant="dot" color="secondary" invisible={categoryFilter.length === allCategories.length}>
                                    <IconButton onClick={() => setIsCategoryFilterMenuOpen(true)} id="category-filter-button" size="small">
                                        <Filter size="xs" />
                                    </IconButton>
                                </Badge>
                                <FilterMenu 
                                    isOpen={isCategoryFilterMenuOpen}
                                    onClose={() => setIsCategoryFilterMenuOpen(false)}
                                    anchorEl={document.getElementById('category-filter-button')}
                                    items={allCategories}
                                    selectedItems={categoryFilter}
                                    setSelectedItems={setCategoryFilter}
                                />
                            </TableCell>
                            <TableCell width={75} sx={{ minWidth: 75 }}>
                                {t('glossary:club')}
                                <Badge variant="dot" color="secondary" invisible={clubfilter.length === allClubs.length}>
                                    <IconButton onClick={() => setIsClubFilterMenuOpen(true)} id="club-filter-button" size="small">
                                        <Filter size="xs" />
                                    </IconButton>
                                </Badge>
                                <FilterMenu 
                                    isOpen={isClubFilterMenuOpen}
                                    onClose={() => setIsClubFilterMenuOpen(false)}
                                    anchorEl={document.getElementById('club-filter-button')}
                                    items={allClubs}
                                    selectedItems={clubfilter}
                                    setSelectedItems={setClubFilter}
                                />
                            </TableCell>
                            <TableCell sx={{ minWidth: 150 }}>
                                {t('glossary:event')}
                                <Badge variant="dot" color="secondary" invisible={eventFilter.length === allEvents.length}>
                                    <IconButton onClick={() => setIsEventFilterMenuOpen(true)} id="event-filter-button" size="small">
                                        <Filter size="xs" />
                                    </IconButton>
                                </Badge>
                                <FilterMenu 
                                    isOpen={isEventFilterMenuOpen}
                                    onClose={() => setIsEventFilterMenuOpen(false)}
                                    anchorEl={document.getElementById('event-filter-button')}
                                    items={allEvents}
                                    selectedItems={eventFilter}
                                    setSelectedItems={setEventFilter}
                                />
                            </TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {filteredInscriptions.map(inscription => (
                            <TableRow key={inscription.eid}>
                                <TableCell align="center">{inscription.bib}</TableCell>
                                <TableCell>{inscription.athlete.firstName} {inscription.athlete.lastName}</TableCell>
                                <TableCell>
                                    {getCategoryAbbr(inscription.athlete.birthdate, inscription.athlete.gender, competition.date)}
                                </TableCell>
                                <TableCell>{inscription.club.abbr}</TableCell>
                                <TableCell>
                                    <Link
                                        color="primary"
                                        underline="hover"
                                        onClick={() => navigate(`/competitions/${competition.eid}/events/${inscription.competitionEvent.eid}`)}
                                        sx={{ cursor: 'pointer' }}
                                    >
                                        {inscription.competitionEvent.name}
                                    </Link>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>
        </Paper>
    )
}
