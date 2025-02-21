import { DisplayInscription$, Eid, Inscription, InscriptionStatus } from '@competition-manager/schemas';
import { Avatar, Badge, Box, FormControl, InputAdornment, List, ListItem, ListItemAvatar, ListItemButton, ListItemIcon, ListItemText, Paper, TextField } from '@mui/material';
import { KeyboardEvent, useEffect, useMemo, useRef, useState } from 'react'
import { useTranslation } from 'react-i18next';
import { Bib, Search } from '../../../../Components';
import { getCategoryAbbr } from '@competition-manager/utils';
import { Popup } from './Popup';
import { useMutation } from 'react-query';
import { useSetAtom } from 'jotai';
import { updateInscriptions } from '../../../../api/Inscription/updateInscriptions';
import { adminInscriptionsAtom, inscriptionsAtom } from '../../../../GlobalsStates';
import { useSnackbar } from '../../../../hooks';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCheck, faQuestion, faXmark } from '@fortawesome/free-solid-svg-icons';

const sortInscriptionStatus = (a: InscriptionStatus, b: InscriptionStatus) => {
    const order = [InscriptionStatus.REMOVED, InscriptionStatus.ACCEPTED, InscriptionStatus.CONFIRMED];
    return order.indexOf(a) - order.indexOf(b);
}

const getStatusIcon = (status: string) => {
    let icon;
    let color;
    switch (status) {
        case InscriptionStatus.CONFIRMED:
            icon = faCheck;
            color = 'success.main';
            break;
        case InscriptionStatus.REMOVED:
            icon = faXmark;
            color = 'error.main';
            break;
        default:
            icon = faQuestion;
            color = undefined;
            break;
    }
    return (
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Avatar sx={{ bgcolor: color, width: 24, height: 24 }}>
                <FontAwesomeIcon icon={icon} color="white" size="xs" />
            </Avatar>
        </Box>
    );
};

const getStatusCounts = (inscriptions: Inscription[]) => {
    return inscriptions.reduce((acc, inscription) => {
        acc[inscription.status] = (acc[inscription.status] || 0) + 1;
        return acc;
    }, {} as Record<string, number>);
};

type ConfirmationProps = {
    competitionEid: Eid;
    competitionDate: Date;
    inscriptions: Inscription[];   
}

export const Confirmation: React.FC<ConfirmationProps> = ({ 
    competitionEid,
    competitionDate,
    inscriptions 
}) => {

    const { t } = useTranslation();

    const { showSnackbar } = useSnackbar();

    const [search, setSearch] = useState<string>('');
    const [selectedIndex, setSelectedIndex] = useState<number>(-1);

    const paperRef = useRef<HTMLDivElement>(null);
    const searchInputRef = useRef<HTMLInputElement>(null);

    const [isPopupOpen, setIsPopupOpen] = useState<boolean>(false);

    const uniqueAthletes = useMemo(() => {
        return inscriptions.reduce((acc, i) => {
            if (!acc.some(a => a.id === i.athlete.id)) {
                acc.push(i.athlete);
            }
            return acc;
        }, [] as Inscription['athlete'][]);
    }, [inscriptions]);

    const filteredAthletes = useMemo(() => {
        const splitSearch = search.split(' ');
        return uniqueAthletes.filter(a => splitSearch.every(s => a.firstName.includes(s) || a.lastName.includes(s) || a.bib.toString().includes(s)));
    }, [uniqueAthletes, search]);

    const handleSelect = (index: number) => {
        setSelectedIndex(index);
        setIsPopupOpen(true);
    };

    const handleKeyDown = (event: KeyboardEvent) => {
        if (event.key === 'ArrowDown') {
            event.preventDefault();
            setSelectedIndex((prevIndex) => prevIndex === filteredAthletes.length - 1 ? -1 : prevIndex + 1);
        } else if (event.key === 'ArrowUp') {
            event.preventDefault();
            setSelectedIndex((prevIndex) => prevIndex === -1 ? filteredAthletes.length - 1 : prevIndex - 1);
        } else if (event.key === 'Enter' && selectedIndex >= 0) {
            event.preventDefault();
            handleSelect(selectedIndex);
        }
    };

    useEffect(() => {
        if (selectedIndex === -1) {
            searchInputRef.current?.focus();

        } else {
            searchInputRef.current?.blur();
            paperRef.current?.focus();
        }
    }, [selectedIndex]);

    const setInscriptions = useSetAtom(inscriptionsAtom);
    const setAdminInscriptions = useSetAtom(adminInscriptionsAtom);

    const mutation = useMutation((updatedInscriptions: Inscription[]) => updateInscriptions(competitionEid, updatedInscriptions), {
        onSuccess: (data) => {
            setInscriptions((prev) => [...prev!.filter(i => !data.some(d => d.eid === i.eid)), ...data.map(d => DisplayInscription$.parse(d))]);
            setAdminInscriptions((prev) => [...prev!.filter(i => !data.some(d => d.eid === i.eid)), ...data]);
        },
        onError: () => showSnackbar(t('glossary:unexpectedError'), 'error')
    });

    const handleConfirm = (updatedInscriptions: Inscription[]) => {
        mutation.mutate(updatedInscriptions);
        setIsPopupOpen(false);
    };

    return (
        <Paper 
            sx={{
                display: 'flex',
                flexDirection: 'column',
                gap: 2,
                p: 2,
                outline: 'none'
            }}
            ref={paperRef}
            onKeyDown={handleKeyDown}
            tabIndex={0}
        >
            <FormControl>
                <TextField
                    id="search-confirmation"
                    placeholder={t('inscription:searchAthlete.placeholder')}
                    fullWidth
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    onFocus={() => setSelectedIndex(-1)}
                    inputRef={searchInputRef}
                    slotProps={{
                        input: {
                            endAdornment: (
                                <InputAdornment position="end">
                                    <Search />
                                </InputAdornment>
                            )
                        }
                    }}
                />
            </FormControl>

            <List 
                sx={{
                    maxHeight: 400,
                    overflow: 'auto'
                }}
            >
                {filteredAthletes.map((athlete, index) => (
                    <ListItem 
                        key={athlete.id} 
                        disablePadding 
                        divider={index !== uniqueAthletes.length - 1}
                    >
                        <ListItemButton 
                            onClick={() => handleSelect(index)}
                            selected={selectedIndex === index}
                        >
                            <ListItemIcon>
                                <Bib value={athlete.bib} size="sm" />
                            </ListItemIcon>
                            <ListItemText 
                                primary={`${athlete.firstName} ${athlete.lastName}`} 
                                secondary={`${getCategoryAbbr(athlete.birthdate, athlete.gender, competitionDate)}`}
                            />
                            <ListItemAvatar>
                                {Object.entries(getStatusCounts(inscriptions.filter(i => i.athlete.id === athlete.id))).sort(([a], [b]) => sortInscriptionStatus(a as InscriptionStatus, b as InscriptionStatus)).map(([status, count]) => {
                                    if (count === 0) return null;
                                    const icon = getStatusIcon(status);
                                    return (
                                        <Badge key={status} badgeContent={count} color="info">
                                            {icon}
                                        </Badge>
                                    );
                                })}
                            </ListItemAvatar>
                        </ListItemButton>
                    </ListItem>
                ))}
            </List>

            {isPopupOpen && (
                <Popup 
                    open={isPopupOpen} 
                    onClose={() => setIsPopupOpen(false)} 
                    inscriptions={inscriptions.filter(i => i.athlete.id === filteredAthletes[selectedIndex]?.id)} 
                    onConfirm={handleConfirm} 
                />
            )}
        </Paper>
    )
}
