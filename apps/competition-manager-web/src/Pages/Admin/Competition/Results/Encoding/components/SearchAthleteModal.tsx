import { getAthletes } from '@/api';
import { Bib, Icons, Loading } from '@/Components';
import {
    AthleteKey$,
    Athlete as AthleteType,
} from '@competition-manager/schemas';
import { getCategoryAbbr } from '@competition-manager/utils';
import {
    Box,
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    IconButton,
    List,
    ListItem,
    ListItemButton,
    ListItemIcon,
    ListItemText,
    Paper,
    TextField,
} from '@mui/material';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useQuery } from 'react-query';

// Component props interface
interface SearchAthleteModalProps {
    open: boolean;
    onClose: () => void;
    onSelectAthlete: (athlete: AthleteType) => void;
    competitionDate: Date;
}

// Component definition
export const SearchAthleteModal: React.FC<SearchAthleteModalProps> = ({
    open,
    onClose,
    onSelectAthlete,
    competitionDate,
}) => {
    const { t } = useTranslation();
    const [searchValue, setSearchValue] = useState<string>('');
    const [isValid, setIsValid] = useState<boolean>(true);
    const [errorMsg, setErrorMsg] = useState('');

    const {
        data: athletes,
        isLoading,
        isError,
        refetch,
    } = useQuery(['athletes', searchValue], () => getAthletes(searchValue), {
        enabled: false,
    });

    const handleSearch = async () => {
        const { success, error } = AthleteKey$.safeParse(searchValue);
        if (!success) {
            setIsValid(false);
            setErrorMsg(
                error.errors.map((e) => t(`zod:${e.message}`)).join(', ')
            );
            return;
        }

        setIsValid(true);
        setErrorMsg('');

        await refetch();
    };

    if (isError) throw new Error('Error while fetching athletes');

    return (
        <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
            <DialogTitle>{t('result:searchAthletes')}</DialogTitle>
            <DialogContent>
                <Box sx={{ mt: 1 }}>
                    <TextField
                        id="search"
                        placeholder={t('competition:searchAthlete.placeholder')}
                        fullWidth
                        value={searchValue}
                        onChange={(e) => setSearchValue(e.target.value)}
                        error={!isValid}
                        helperText={errorMsg}
                        InputProps={{
                            endAdornment: (
                                <IconButton onClick={handleSearch}>
                                    <Icons.Search />
                                </IconButton>
                            ),
                        }}
                        onKeyDown={(e) => {
                            if (e.key === 'Enter') {
                                handleSearch();
                            }
                        }}
                    />

                    <Paper
                        sx={{
                            width: '100%',
                            overflow: 'auto',
                            maxHeight: 300,
                        }}
                    >
                        {isLoading && <Loading />}

                        <List disablePadding>
                            {athletes && athletes.length === 0 && (
                                <ListItem>
                                    <ListItemText
                                        primary={t(
                                            'competition:noAthletesFound'
                                        )}
                                    />
                                </ListItem>
                            )}

                            {athletes &&
                                athletes.map(
                                    (athlete: AthleteType, index: number) => (
                                        <ListItem
                                            key={athlete.id}
                                            disablePadding
                                            divider={
                                                index !== athletes.length - 1
                                            }
                                        >
                                            <ListItemButton
                                                onClick={() => {
                                                    onSelectAthlete(athlete);
                                                }}
                                            >
                                                <ListItemIcon>
                                                    <Bib
                                                        value={athlete.bib}
                                                        size="sm"
                                                    />
                                                </ListItemIcon>
                                                <ListItemText
                                                    primary={`${athlete.firstName} ${athlete.lastName}`}
                                                    secondary={`${
                                                        athlete.club.abbr
                                                    } - ${getCategoryAbbr(
                                                        athlete.birthdate,
                                                        athlete.gender,
                                                        competitionDate
                                                    )}`}
                                                />
                                            </ListItemButton>
                                        </ListItem>
                                    )
                                )}
                        </List>
                    </Paper>
                </Box>
            </DialogContent>
            <DialogActions>
                <Button onClick={onClose}>{t('buttons:close')}</Button>
            </DialogActions>
        </Dialog>
    );
};
