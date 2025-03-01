/**
 * File: apps/competition-manager-web/src/Components/InscriptionWizard/Step/Athlete.tsx
 *
 * This component handles athlete selection in the inscription wizard.
 * It provides functionality for:
 * 1. Searching and selecting existing athletes
 * 2. Creating one-day athletes through different permission types (FOREIGN, BPM, ALL)
 */

import { createOneDayAthlete, getAthletes } from '@/api';
import { Bib, Icons, Loading, StepperButtons } from '@/Components';
import {
    competitionAtom,
    inscriptionDataAtom,
    inscriptionsAtom,
    userInscriptionsAtom,
} from '@/GlobalsStates';
import { useSnackbar } from '@/hooks';
import {
    AthleteKey$,
    Athlete as AthleteType,
    CreateOneDayAthlete,
    CreateOneDayAthlete$,
    OneDayPermission,
} from '@competition-manager/schemas';
import { getCategoryAbbr } from '@competition-manager/utils';
import {
    Alert,
    Box,
    Button,
    Card,
    CardContent,
    CardHeader,
    IconButton,
    List,
    ListItem,
    ListItemButton,
    ListItemIcon,
    ListItemText,
    Paper,
    TextField,
    Typography,
} from '@mui/material';
import { useAtom, useAtomValue } from 'jotai';
import { useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useMutation, useQuery, useQueryClient } from 'react-query';
import { FormData, OneDayAthleteDialog } from './OneDayAthleteDialog';

type AthleteProps = {
    isAdmin: boolean;
    handleNext: () => void;
};

export const Athlete: React.FC<AthleteProps> = ({ isAdmin, handleNext }) => {
    const { t } = useTranslation();
    const queryClient = useQueryClient();
    const { showSnackbar } = useSnackbar();

    const competition = useAtomValue(competitionAtom);
    if (!competition) throw new Error('No competition found');
    const inscriptions = useAtomValue(inscriptionsAtom);
    if (!inscriptions) throw new Error('No inscriptions found');
    const userInscriptions = useAtomValue(userInscriptionsAtom);
    if (!userInscriptions) throw new Error('No user inscriptions found');

    const [{ athlete }, setInscriptionData] = useAtom(inscriptionDataAtom);

    const [dialogOpen, setDialogOpen] = useState(false);
    const [selectedPermission, setSelectedPermission] =
        useState<OneDayPermission | null>(null);

    // Create mutation for one-day athlete
    const createAthleteMutation = useMutation(
        (data: CreateOneDayAthlete) =>
            createOneDayAthlete(competition.eid, data),
        {
            onSuccess: (newAthlete) => {
                // Update the athlete in the form
                setAthlete(newAthlete);
                // Close the dialog
                setDialogOpen(false);
                // Invalidate athletes query to refresh the list if needed
                queryClient.invalidateQueries('athletes');
            },
            onError: (error) => {
                console.error('Failed to create one-day athlete:', error);
                showSnackbar(t('competition:oneDayAthlete.error'), 'error');
            },
        }
    );

    const setAthlete = (athlete: AthleteType | undefined) => {
        setInscriptionData({ athlete, inscriptionsData: [] });
    };

    const isAlreadyInscribed = useMemo(() => {
        if (!athlete) return false;
        return inscriptions.some((i) => i.athlete.license === athlete.license);
    }, [athlete, inscriptions]);

    const isUserInscribed = useMemo(() => {
        if (!athlete) return false;
        return userInscriptions.some(
            (i) => i.athlete.license === athlete.license
        );
    }, [athlete, userInscriptions]);

    const isClubAllowed = useMemo(() => {
        if (!athlete) return false;
        if (competition.allowedClubs.length === 0) return true;
        return competition.allowedClubs
            .map((c) => c.id)
            .includes(athlete.club.id);
    }, [athlete, competition]);

    const isDisabled =
        !isAdmin &&
        ((isAlreadyInscribed && !isUserInscribed) || !isClubAllowed);

    const handleOneDayAthleteClick = (permission: OneDayPermission) => {
        setSelectedPermission(permission);
        setDialogOpen(true);
    };

    const handleOneDayAthleteSubmit = async (formData: FormData) => {
        if (!formData.birthdate || !formData.gender) return;

        const data = {
            firstName: formData.firstName,
            lastName: formData.lastName,
            birthdate: formData.birthdate,
            gender: formData.gender,
            clubAbbr:
                selectedPermission === OneDayPermission.FOREIGN
                    ? formData.country
                    : 'NA',
            metadata:
                selectedPermission === OneDayPermission.FOREIGN
                    ? {
                          club: formData.club,
                          license: formData.license,
                      }
                    : {},
        };

        createAthleteMutation.mutate(CreateOneDayAthlete$.parse(data));
    };

    return (
        <Box width="100%">
            <SearchAthlete isVisible={!athlete} onAthleteSelect={setAthlete} />

            {!athlete && competition.oneDayPermissions.length > 0 && (
                <Card
                    sx={{
                        mt: 2,
                        width: '100%',
                    }}
                >
                    <CardContent
                        sx={{
                            display: 'flex',
                            flexDirection: 'column',
                            gap: 3,
                        }}
                    >
                        <Alert severity="info">
                            {t('competition:oneDayAthlete.info')}
                        </Alert>
                        <Box
                            sx={{
                                display: 'flex',
                                gap: 2,
                                justifyContent: 'center',
                                flexWrap: 'wrap',
                            }}
                        >
                            {competition.oneDayPermissions.includes(
                                OneDayPermission.FOREIGN
                            ) && (
                                <Button
                                    variant="outlined"
                                    onClick={() =>
                                        handleOneDayAthleteClick(
                                            OneDayPermission.FOREIGN
                                        )
                                    }
                                >
                                    {t(
                                        'competition:oneDayAthlete.foreign.label'
                                    )}
                                </Button>
                            )}
                            {competition.oneDayPermissions.includes(
                                OneDayPermission.BPM
                            ) && (
                                <Button
                                    variant="outlined"
                                    onClick={() =>
                                        handleOneDayAthleteClick(
                                            OneDayPermission.BPM
                                        )
                                    }
                                >
                                    {t('competition:oneDayAthlete.bpm.label')}
                                </Button>
                            )}
                            {competition.oneDayPermissions.includes(
                                OneDayPermission.ALL
                            ) && (
                                <Button
                                    variant="outlined"
                                    onClick={() =>
                                        handleOneDayAthleteClick(
                                            OneDayPermission.ALL
                                        )
                                    }
                                >
                                    {t('competition:oneDayAthlete.all.label')}
                                </Button>
                            )}
                        </Box>
                    </CardContent>
                </Card>
            )}

            {dialogOpen && (
                <OneDayAthleteDialog
                    open={dialogOpen}
                    onClose={() => setDialogOpen(false)}
                    permission={selectedPermission}
                    onSubmit={handleOneDayAthleteSubmit}
                    referenceDate={competition.date}
                    isSubmitting={createAthleteMutation.isLoading}
                />
            )}

            {athlete && (
                <>
                    <Card
                        sx={{
                            width: '100%',
                            mb: 2,
                        }}
                    >
                        <CardHeader
                            avatar={<Bib value={athlete.bib} size="lg" />}
                            title={`${athlete.firstName} ${athlete.lastName}`}
                            titleTypographyProps={{ variant: 'h5' }}
                            sx={{
                                textAlign: 'right',
                                borderBottom: 1,
                                borderColor: 'divider',
                            }}
                        />
                        <CardContent sx={{ padding: 0 }}>
                            <List disablePadding>
                                <ListItem
                                    sx={{
                                        display: 'flex',
                                        justifyContent: 'space-between',
                                    }}
                                >
                                    <Typography variant="h6">
                                        {t('glossary:club')}
                                    </Typography>
                                    <Typography variant="subtitle1">
                                        {athlete.club.abbr}
                                    </Typography>
                                </ListItem>
                                <ListItem
                                    sx={{
                                        display: 'flex',
                                        justifyContent: 'space-between',
                                    }}
                                >
                                    <Typography variant="h6">
                                        {t('glossary:category')}
                                    </Typography>
                                    <Typography variant="subtitle1">
                                        {getCategoryAbbr(
                                            athlete.birthdate,
                                            athlete.gender,
                                            competition.date
                                        )}
                                    </Typography>
                                </ListItem>
                                <ListItem
                                    sx={{
                                        display: 'flex',
                                        justifyContent: 'space-between',
                                    }}
                                >
                                    <Typography variant="h6">
                                        {t('labels:birthdate')}
                                    </Typography>
                                    <Typography variant="subtitle1">
                                        {athlete.birthdate.toLocaleDateString(
                                            'fr'
                                        )}
                                    </Typography>
                                </ListItem>
                            </List>
                        </CardContent>
                    </Card>

                    {isAlreadyInscribed && !isUserInscribed && (
                        <Alert severity={isAdmin ? 'warning' : 'error'}>
                            {t('competition:athleteAlreadyInscribedNotByYou')}
                        </Alert>
                    )}

                    {!isClubAllowed && (
                        <Alert severity={isAdmin ? 'warning' : 'error'}>
                            {t('competition:clubNotAllowed')}
                        </Alert>
                    )}

                    <StepperButtons
                        buttons={[
                            {
                                label: t('competition:changeAthlete'),
                                onClick: () => setAthlete(undefined),
                                variant: 'outlined',
                            },
                            {
                                label: t('buttons:next'),
                                onClick: handleNext,
                                disabled: isDisabled,
                            },
                        ]}
                    />
                </>
            )}
        </Box>
    );
};

type SearchAthleteProps = {
    isVisible: boolean;
    onAthleteSelect: (athlete: AthleteType) => void;
};

const SearchAthlete: React.FC<SearchAthleteProps> = ({
    isVisible,
    onAthleteSelect,
}) => {
    const { t } = useTranslation();

    const competition = useAtomValue(competitionAtom);

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

    if (!isVisible) return null;

    if (isError) throw new Error('Error while fetching athletes');

    return (
        <Box
            display="flex"
            alignItems="center"
            justifyContent="center"
            width="100%"
            flexDirection="column"
            gap={2}
        >
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
                                primary={t('competition:noAthletesFound')}
                            />
                        </ListItem>
                    )}

                    {athletes &&
                        athletes.map((athlete: AthleteType, index: number) => (
                            <ListItem
                                key={athlete.id}
                                disablePadding
                                divider={index !== athletes.length - 1}
                            >
                                <ListItemButton
                                    onClick={() => onAthleteSelect(athlete)}
                                >
                                    <ListItemIcon>
                                        <Bib value={athlete.bib} size="sm" />
                                    </ListItemIcon>
                                    <ListItemText
                                        primary={`${athlete.firstName} ${athlete.lastName}`}
                                        secondary={`${
                                            athlete.club.abbr
                                        } - ${getCategoryAbbr(
                                            athlete.birthdate,
                                            athlete.gender,
                                            competition?.date
                                        )}`}
                                    />
                                </ListItemButton>
                            </ListItem>
                        ))}
                </List>
            </Paper>
        </Box>
    );
};
