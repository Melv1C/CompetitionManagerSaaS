/**
 * Component for displaying all inscriptions in a competition with filtering capabilities
 */

import { FilterMenu, Icons } from '@/Components';
import { Competition, DisplayInscription } from '@competition-manager/schemas';
import { getCategoryAbbr } from '@competition-manager/utils';
import {
    Badge,
    IconButton,
    Link,
    Stack,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Typography,
} from '@mui/material';
import { useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';

interface AllInscriptionsSectionProps {
    competition: Competition;
    inscriptions: DisplayInscription[];
}

/**
 * Section component that displays all inscriptions with filtering capabilities
 * Allows filtering by category, club, and event
 */
export const AllInscriptionsSection: React.FC<AllInscriptionsSectionProps> = ({
    competition,
    inscriptions,
}) => {
    const { t } = useTranslation();
    const navigate = useNavigate();

    // Extract unique values for filters
    const allCategories = useMemo(
        () => [
            ...new Set(
                inscriptions.map((i) =>
                    getCategoryAbbr(
                        i.athlete.birthdate,
                        i.athlete.gender,
                        competition.date
                    )
                )
            ),
        ],
        [inscriptions, competition.date]
    );

    const allClubs = useMemo(
        () => [...new Set(inscriptions.map((i) => i.club.abbr))],
        [inscriptions]
    );

    const allEvents = useMemo(
        () => [...new Set(inscriptions.map((i) => i.competitionEvent.name))],
        [inscriptions]
    );

    // Filter states
    const [categoryFilter, setCategoryFilter] = useState(allCategories);
    const [clubFilter, setClubFilter] = useState(allClubs);
    const [eventFilter, setEventFilter] = useState(allEvents);

    useEffect(() => {
        setCategoryFilter(allCategories);
        setClubFilter(allClubs);
        setEventFilter(allEvents);
    }, [allCategories, allClubs, allEvents]);

    // Filter menu states
    const [isCategoryFilterMenuOpen, setIsCategoryFilterMenuOpen] =
        useState(false);
    const [isClubFilterMenuOpen, setIsClubFilterMenuOpen] = useState(false);
    const [isEventFilterMenuOpen, setIsEventFilterMenuOpen] = useState(false);

    // Apply filters to inscriptions
    const filteredInscriptions = useMemo(
        () =>
            inscriptions
                .sort((a, b) => b.date.getTime() - a.date.getTime())
                .filter((i) => {
                    const category = getCategoryAbbr(
                        i.athlete.birthdate,
                        i.athlete.gender,
                        competition.date
                    );
                    return (
                        categoryFilter.includes(category) &&
                        clubFilter.includes(i.club.abbr) &&
                        eventFilter.includes(i.competitionEvent.name)
                    );
                }),
        [
            inscriptions,
            categoryFilter,
            clubFilter,
            eventFilter,
            competition.date,
        ]
    );

    return (
        <Stack spacing={2}>
            <Typography variant="h6">
                {t('competition:allInscriptions')} ({inscriptions.length})
            </Typography>

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
                                <Badge
                                    variant="dot"
                                    color="secondary"
                                    invisible={
                                        categoryFilter.length ===
                                        allCategories.length
                                    }
                                >
                                    <IconButton
                                        onClick={() =>
                                            setIsCategoryFilterMenuOpen(true)
                                        }
                                        id="category-filter-button"
                                        size="small"
                                    >
                                        <Icons.Filter size="xs" />
                                    </IconButton>
                                </Badge>
                                <FilterMenu
                                    isOpen={isCategoryFilterMenuOpen}
                                    onClose={() =>
                                        setIsCategoryFilterMenuOpen(false)
                                    }
                                    anchorEl={document.getElementById(
                                        'category-filter-button'
                                    )}
                                    items={allCategories}
                                    selectedItems={categoryFilter}
                                    setSelectedItems={setCategoryFilter}
                                />
                            </TableCell>
                            <TableCell width={75} sx={{ minWidth: 75 }}>
                                {t('glossary:club')}
                                <Badge
                                    variant="dot"
                                    color="secondary"
                                    invisible={
                                        clubFilter.length === allClubs.length
                                    }
                                >
                                    <IconButton
                                        onClick={() =>
                                            setIsClubFilterMenuOpen(true)
                                        }
                                        id="club-filter-button"
                                        size="small"
                                    >
                                        <Icons.Filter size="xs" />
                                    </IconButton>
                                </Badge>
                                <FilterMenu
                                    isOpen={isClubFilterMenuOpen}
                                    onClose={() =>
                                        setIsClubFilterMenuOpen(false)
                                    }
                                    anchorEl={document.getElementById(
                                        'club-filter-button'
                                    )}
                                    items={allClubs}
                                    selectedItems={clubFilter}
                                    setSelectedItems={setClubFilter}
                                />
                            </TableCell>
                            <TableCell sx={{ minWidth: 150 }}>
                                {t('glossary:event')}
                                <Badge
                                    variant="dot"
                                    color="secondary"
                                    invisible={
                                        eventFilter.length === allEvents.length
                                    }
                                >
                                    <IconButton
                                        onClick={() =>
                                            setIsEventFilterMenuOpen(true)
                                        }
                                        id="event-filter-button"
                                        size="small"
                                    >
                                        <Icons.Filter size="xs" />
                                    </IconButton>
                                </Badge>
                                <FilterMenu
                                    isOpen={isEventFilterMenuOpen}
                                    onClose={() =>
                                        setIsEventFilterMenuOpen(false)
                                    }
                                    anchorEl={document.getElementById(
                                        'event-filter-button'
                                    )}
                                    items={allEvents}
                                    selectedItems={eventFilter}
                                    setSelectedItems={setEventFilter}
                                />
                            </TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {filteredInscriptions.map((inscription) => (
                            <TableRow key={inscription.eid}>
                                <TableCell align="center">
                                    {inscription.bib}
                                </TableCell>
                                <TableCell>
                                    {inscription.athlete.firstName}{' '}
                                    {inscription.athlete.lastName}
                                </TableCell>
                                <TableCell>
                                    {getCategoryAbbr(
                                        inscription.athlete.birthdate,
                                        inscription.athlete.gender,
                                        competition.date
                                    )}
                                </TableCell>
                                <TableCell>{inscription.club.abbr}</TableCell>
                                <TableCell>
                                    <Link
                                        color="primary"
                                        underline="hover"
                                        onClick={() =>
                                            navigate(
                                                `/competitions/${competition.eid}/events/${inscription.competitionEvent.eid}`
                                            )
                                        }
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
        </Stack>
    );
};
