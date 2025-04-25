import { ShowUsersNumber } from '@/Components';
import { competitionAtom, inscriptionsAtom } from '@/GlobalsStates';
import { useDeviceSize } from '@/hooks';
import { Category, Event } from '@competition-manager/schemas';
import { faFilter, faSearch } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
    Box,
    Card,
    FormControl,
    IconButton,
    InputAdornment,
    Menu,
    MenuItem,
    Paper,
    Select,
    SelectChangeEvent,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    TextField,
    Typography,
} from '@mui/material';
import { useAtomValue } from 'jotai';
import { useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';

export const Schedule = () => {
    const { t } = useTranslation();
    const navigate = useNavigate();
    const { isMobile } = useDeviceSize();

    const competition = useAtomValue(competitionAtom);
    const inscriptions = useAtomValue(inscriptionsAtom);
    if (!competition) throw new Error('No competition found');
    if (!inscriptions) throw new Error('No inscriptions found');

    // Filter states
    const [nameFilter, setNameFilter] = useState('');
    const [selectedCategory, setSelectedCategory] = useState<string>('');
    const [abbrFilter, setAbbrFilter] = useState('');

    // Menu state
    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
    const open = Boolean(anchorEl);

    const handleOpenMenu = (event: React.MouseEvent<HTMLElement>) => {
        setAnchorEl(event.currentTarget);
    };

    const handleCloseMenu = () => {
        setAnchorEl(null);
    };

    // Get all unique categories across all events
    const allCategories = useMemo(() => {
        // Use a Map to store categories by ID to ensure uniqueness
        const categoriesMap = new Map<number, Category>();

        competition.events.forEach((event) => {
            event.categories.forEach((category) => {
                // Only add if the category ID isn't already in the map
                if (!categoriesMap.has(category.id)) {
                    categoriesMap.set(category.id, category);
                }
            });
        });

        // Convert map values to array and sort by ID
        return Array.from(categoriesMap.values()).sort((a, b) => a.id - b.id);
    }, [competition.events]);

    const allEvents = useMemo(() => {
        // Use a Map to store unique events
        const eventMap = new Map<number, Event>(); // Change back to Map for events
        competition.events.forEach((event) => {
            // Only add if the event ID isn't already in the map
            if (!eventMap.has(event.event.id)) {
                eventMap.set(event.event.id, event.event);
            }
        });
        // Convert map values to array and sort by ID
        return Array.from(eventMap.values()).sort((a, b) => a.id - b.id);
    }, [competition.events]);

    // Handle category selection changes
    const handleCategoryChange = (event: SelectChangeEvent) => {
        setSelectedCategory(event.target.value as string);
    };

    // Filter events based on name, selected category, and abbr
    const filteredEvents = useMemo(() => {
        return competition.events.filter((event) => {
            // Filter by name (case insensitive)
            const matchesName = event.name
                .toLowerCase()
                .includes(nameFilter.toLowerCase());

            // Filter by category (if selected)
            const matchesCategory =
                selectedCategory === '' ||
                event.categories.some(
                    (category) => category.id === Number(selectedCategory)
                );

            // Filter by abbr (if provided)
            const matchesAbbr =
                abbrFilter === '' ||
                event.event.abbr
                    .toLowerCase()
                    .includes(abbrFilter.toLowerCase());

            return matchesName && matchesCategory && matchesAbbr;
        });
    }, [competition.events, nameFilter, selectedCategory, abbrFilter]);

    return (
        <Box
            sx={{
                width: 'max-content',
                minWidth: isMobile ? '100%' : 500,
                maxWidth: '100%',

                margin: 'auto',
            }}
        >
            <Card
                elevation={1}
                sx={{
                    borderRadius: 2,
                    overflow: 'visible',
                    mb: 2,
                }}
            >
                <Box
                    sx={{
                        p: 2,
                        display: 'flex',
                        alignItems: 'center',
                        gap: 1,
                    }}
                >
                    <TextField
                        placeholder={t('glossary:search')}
                        variant="outlined"
                        size="small"
                        fullWidth
                        value={nameFilter}
                        onChange={(e) => setNameFilter(e.target.value)}
                        InputProps={{
                            startAdornment: (
                                <InputAdornment position="start">
                                    <FontAwesomeIcon icon={faSearch} />
                                </InputAdornment>
                            ),
                            sx: { borderRadius: 2 },
                        }}
                    />
                    <IconButton
                        color="primary"
                        onClick={handleOpenMenu}
                        aria-label="Filter"
                    >
                        <FontAwesomeIcon icon={faFilter} />
                    </IconButton>
                </Box>

                <Menu
                    anchorEl={anchorEl}
                    open={open}
                    onClose={handleCloseMenu}
                    elevation={3}
                    anchorOrigin={{
                        vertical: 'bottom',
                        horizontal: 'right',
                    }}
                    transformOrigin={{
                        vertical: 'top',
                        horizontal: 'right',
                    }}
                    PaperProps={{
                        sx: { borderRadius: 2, mt: 1 },
                    }}
                >
                    <Box sx={{ p: 2, width: 280 }}>
                        <Typography
                            variant="subtitle2"
                            sx={{ mb: 1, fontWeight: 500 }}
                        >
                            {t('glossary:categories')}
                        </Typography>

                        <FormControl fullWidth size="small" sx={{ mb: 2.5 }}>
                            <Select
                                value={selectedCategory}
                                onChange={handleCategoryChange}
                                displayEmpty
                                sx={{ borderRadius: 1 }}
                            >
                                <MenuItem value="">
                                    <em>{t('glossary:all')}</em>
                                </MenuItem>
                                {allCategories.map((category) => (
                                    <MenuItem
                                        key={category.id}
                                        value={category.id}
                                    >
                                        {category.abbr}
                                    </MenuItem>
                                ))}
                            </Select>
                        </FormControl>

                        <Typography
                            variant="subtitle2"
                            sx={{ mb: 1, fontWeight: 500 }}
                        >
                            {t('glossary:event')}
                        </Typography>
                        <FormControl fullWidth size="small" sx={{ mb: 1 }}>
                            <Select
                                value={abbrFilter}
                                onChange={(e) => setAbbrFilter(e.target.value)}
                                displayEmpty
                                sx={{ borderRadius: 1 }}
                            >
                                <MenuItem value="">
                                    <em>{t('glossary:all')}</em>
                                </MenuItem>
                                {allEvents.map((event) => (
                                    <MenuItem key={event.id} value={event.abbr}>
                                        {event.abbr}
                                    </MenuItem>
                                ))}
                            </Select>
                        </FormControl>
                    </Box>
                </Menu>
            </Card>

            <TableContainer
                component={Paper}
                elevation={1}
                sx={{
                    borderRadius: 2,
                    overflow: 'hidden',
                }}
            >
                <Table size="small">
                    <TableHead sx={{ backgroundColor: 'rgba(0, 0, 0, 0.04)' }}>
                        <TableRow>
                            <TableCell width={50}>
                                {t('labels:schedule')}
                            </TableCell>
                            <TableCell>{t('glossary:event')}</TableCell>
                            <TableCell></TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {filteredEvents
                            .sort(
                                (a, b) =>
                                    a.schedule.getTime() - b.schedule.getTime()
                            )
                            .map((event) => (
                                <TableRow
                                    key={event.id}
                                    onClick={() =>
                                        navigate(
                                            `/competitions/${competition.eid}/events/${event.eid}`
                                        )
                                    }
                                    sx={{
                                        cursor: 'pointer',
                                        '&:hover': {
                                            backgroundColor:
                                                'rgba(0, 0, 0, 0.04)',
                                            transition:
                                                'background-color 0.3s ease',
                                        },
                                    }}
                                >
                                    <TableCell>
                                        {event.schedule.toLocaleTimeString(
                                            'fr',
                                            {
                                                hour: '2-digit',
                                                minute: '2-digit',
                                            }
                                        )}
                                    </TableCell>
                                    <TableCell>{event.name}</TableCell>
                                    <TableCell align="center">
                                        <ShowUsersNumber
                                            value={
                                                inscriptions.filter(
                                                    (i) =>
                                                        i.competitionEvent
                                                            .id === event.id
                                                ).length
                                            }
                                        />
                                    </TableCell>
                                </TableRow>
                            ))}
                    </TableBody>
                </Table>
            </TableContainer>
        </Box>
    );
};
