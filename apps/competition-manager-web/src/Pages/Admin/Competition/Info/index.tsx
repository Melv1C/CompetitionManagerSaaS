import { getClubs, updateCompetition } from '@/api';
import { Icons, Loading, TextFieldWith$, WysiwygEditor } from '@/Components';
import { CircleButton } from '@/Components/CircleButton';
import { MaxWidth } from '@/Components/MaxWidth';
import { competitionAtom } from '@/GlobalsStates';
import {
    Competition,
    Competition$,
    Id,
    OneDayPermission,
    PaymentMethod,
    UpdateCompetition,
} from '@competition-manager/schemas';
import {
    Box,
    Chip,
    Divider,
    FormControl,
    FormLabel,
    InputLabel,
    MenuItem,
    Select,
    Switch,
    Typography,
} from '@mui/material';
import { MobileDatePicker, MobileDateTimePicker } from '@mui/x-date-pickers';
import { useAtom } from 'jotai';
import { useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useQuery } from 'react-query';
import { useBlocker } from 'react-router-dom';
import { OnLeavePopup } from './OnLeavePopup';

export const Info = () => {
    const { t } = useTranslation();

    const { data: clubs } = useQuery('clubs', getClubs);

    const [competition, setCompetition] = useAtom(competitionAtom);
    const [competitionState, setCompetitionState] = useState<Competition>();

    const allowedClubsId = useMemo(
        () => competitionState?.allowedClubs.map((club) => club.id) || [],
        [competitionState]
    );
    const freeClubsId = useMemo(
        () => competitionState?.freeClubs.map((club) => club.id) || [],
        [competitionState]
    );

    const [isNameValid, setIsNameValid] = useState(true);
    const [isDateValid, setIsDateValid] = useState(true);
    const [isCloseDateValid, setIsCloseDateValid] = useState(true);
    const [isLocationValid, setIsLocationValid] = useState(true);
    const [isEmailValid, setIsEmailValid] = useState(true);
    const [isPhoneValid, setIsPhoneValid] = useState(true);
    const [isStartInscriptionDateValid, setIsStartInscriptionDateValid] =
        useState(true);
    const [isEndInscriptionDateValid, setIsEndInscriptionDateValid] =
        useState(true);
    const [isMaxEventByAthleteValid, setIsMaxEventByAthleteValid] =
        useState(true);

    const [isMultiDay, setIsMultiDay] = useState(
        competition?.closeDate !== null
    );

    const isModified = useMemo(
        () => JSON.stringify(competition) !== JSON.stringify(competitionState),
        [competition, competitionState]
    );

    const isFormValid = useMemo(
        () =>
            isNameValid &&
            isDateValid &&
            (isMultiDay ? isCloseDateValid : true) &&
            isLocationValid &&
            isEmailValid &&
            isPhoneValid &&
            isStartInscriptionDateValid &&
            isEndInscriptionDateValid &&
            isMaxEventByAthleteValid,
        [
            isNameValid,
            isDateValid,
            isMultiDay,
            isCloseDateValid,
            isLocationValid,
            isEmailValid,
            isPhoneValid,
            isStartInscriptionDateValid,
            isEndInscriptionDateValid,
            isMaxEventByAthleteValid,
        ]
    );

    const isSaveEnabled = useMemo(
        () => isFormValid && isModified,
        [isFormValid, isModified]
    );

    useEffect(() => {
        if (
            competition &&
            (!competitionState || competition.eid !== competitionState.eid)
        ) {
            setCompetitionState(competition);
            setIsMultiDay(competition.closeDate !== null);
        }
    }, [competition, competitionState]);

    const onSave = () => {
        if (isSaveEnabled && competitionState) {
            const updateCompetiton: UpdateCompetition = {
                ...competitionState,
                optionsId: competitionState.options.map((option) => option.id),
                freeClubsId: competitionState.freeClubs.map((club) => club.id),
                allowedClubsId: competitionState.allowedClubs.map(
                    (club) => club.id
                ),
            };

            updateCompetition(competitionState.eid, updateCompetiton)
                .then((newCompetition) => {
                    setCompetition(newCompetition);
                    setCompetitionState(newCompetition);
                })
                .catch((error) => {
                    console.error(error);
                });
        }
    };

    // TODO: extract to custom hook
    //--------------------------------------------------------------------------------
    const blocker = useBlocker(isModified);
    const [isBlock, setIsBlock] = useState(false);

    useEffect(() => {
        const handleBeforeUnload = (e: BeforeUnloadEvent) => {
            if (isModified) {
                e.preventDefault();
                e.returnValue = '';
            }
        };
        window.addEventListener('beforeunload', handleBeforeUnload);

        return () => {
            window.removeEventListener('beforeunload', handleBeforeUnload);
        };
    }, [isModified]);

    useEffect(() => {
        if (blocker.state === 'blocked') {
            setIsBlock(true);
        }
    }, [blocker]);

    const handleStay = () => {
        setIsBlock(false);
    };

    const handleLeave = () => {
        setIsBlock(false);
        if (blocker.state === 'blocked') {
            blocker.proceed();
        }
    };
    //--------------------------------------------------------------------------------

    if (!competitionState) {
        return <Loading />;
    }

    return (
        <MaxWidth>
            {isBlock && (
                <OnLeavePopup onStay={handleStay} onLeave={handleLeave} />
            )}
            <Box component="form">
                <Box
                    sx={{
                        display: 'flex',
                        gap: '1rem',
                        alignItems: 'center',
                        position: 'sticky',
                        padding: '1rem',
                        top: '0',
                        zIndex: 10,
                        backgroundColor: 'white',
                        borderBottom: '1px solid rgba(0, 0, 0, 0.12)',
                    }}
                >
                    <FormControl>
                        <FormLabel sx={{ textAlign: 'center' }}>
                            {t('labels:publish')}
                        </FormLabel>
                        <Switch
                            checked={competitionState.publish}
                            onChange={() =>
                                setCompetitionState({
                                    ...competitionState,
                                    publish: !competitionState.publish,
                                })
                            }
                            sx={{ alignSelf: 'center' }}
                        />
                    </FormControl>

                    <TextFieldWith$
                        id="name"
                        label={{ value: t('labels:name') }}
                        value={{
                            value: competitionState.name,
                            onChange: (value) =>
                                setCompetitionState({
                                    ...competitionState,
                                    name: value,
                                }),
                        }}
                        validator={{
                            Schema$: Competition$.shape.name,
                            isValid: isNameValid,
                            setIsValid: setIsNameValid,
                        }}
                        formControlProps={{ fullWidth: true }}
                    />

                    <CircleButton
                        onClick={onSave}
                        variant="contained"
                        color="success"
                        disabled={!isSaveEnabled}
                    >
                        <Icons.Save size="xl" />
                    </CircleButton>
                </Box>

                <Box
                    sx={{
                        display: 'flex',
                        flexDirection: 'column',
                        gap: '1rem',
                        padding: '1rem',
                    }}
                >
                    <Box
                        sx={{
                            display: 'flex',
                            flexWrap: 'wrap',
                            gap: '1rem',
                        }}
                    >
                        <MobileDatePicker
                            label={
                                isMultiDay
                                    ? t('labels:start_date')
                                    : t('labels:date')
                            }
                            value={competitionState.date}
                            onChange={(date) => {
                                if (!date) {
                                    setIsDateValid(false);
                                    return;
                                }
                                setCompetitionState({
                                    ...competitionState,
                                    date: date,
                                });
                            }}
                            onError={(error) => setIsDateValid(!error)}
                            format="dd/MM/yyyy"
                            slotProps={{ textField: { required: true } }}
                        />

                        <FormControl>
                            <FormLabel sx={{ textAlign: 'center' }}>
                                {t('labels:multi_day')}
                            </FormLabel>
                            <Switch
                                checked={isMultiDay}
                                onChange={() => {
                                    setIsMultiDay((prev) => !prev);
                                    setCompetitionState({
                                        ...competitionState,
                                        closeDate: null,
                                    });
                                    setIsCloseDateValid(true);
                                }}
                                sx={{ alignSelf: 'center' }}
                            />
                        </FormControl>

                        {isMultiDay && (
                            <MobileDatePicker
                                label={t('labels:end_date')}
                                value={competitionState.closeDate}
                                onChange={(date) =>
                                    setCompetitionState({
                                        ...competitionState,
                                        closeDate: date,
                                    })
                                }
                                onError={(error) => setIsCloseDateValid(!error)}
                                format="dd/MM/yyyy"
                                minDate={
                                    competitionState.date
                                        ? new Date(
                                              competitionState.date.getTime() +
                                                  24 * 60 * 60 * 1000
                                          )
                                        : undefined
                                }
                                slotProps={{ textField: { required: true } }}
                            />
                        )}
                    </Box>

                    <WysiwygEditor
                        value={competitionState.description}
                        onChange={(value) =>
                            setCompetitionState({
                                ...competitionState,
                                description: value,
                            })
                        }
                        placeholder={t('labels:description')}
                    />

                    <TextFieldWith$
                        id="location"
                        label={{ value: t('labels:location') }}
                        value={{
                            value: competitionState.location || '',
                            onChange: (value) =>
                                setCompetitionState({
                                    ...competitionState,
                                    location: value,
                                }),
                        }}
                        validator={{
                            Schema$: Competition$.shape.location,
                            isValid: isLocationValid,
                            setIsValid: setIsLocationValid,
                        }}
                    />

                    <Divider />

                    <Typography variant="h6">
                        {t('adminCompetition:contactInformation')}
                    </Typography>

                    <TextFieldWith$
                        id="contactEmail"
                        label={{ value: t('labels:contactEmail') }}
                        value={{
                            value: competitionState.email,
                            onChange: (value) =>
                                setCompetitionState({
                                    ...competitionState,
                                    email: value,
                                }),
                        }}
                        validator={{
                            Schema$: Competition$.shape.email,
                            isValid: isEmailValid,
                            setIsValid: setIsEmailValid,
                        }}
                    />

                    <TextFieldWith$
                        id="contactPhone"
                        label={{ value: t('labels:contactPhone') }}
                        value={{
                            value: competitionState.phone || '',
                            onChange: (value) =>
                                setCompetitionState({
                                    ...competitionState,
                                    phone: value,
                                }),
                        }}
                        validator={{
                            Schema$: Competition$.shape.phone,
                            isValid: isPhoneValid,
                            setIsValid: setIsPhoneValid,
                        }}
                    />

                    <Divider />

                    <Typography variant="h6">
                        {t('adminCompetition:inscriptionInformation')}
                    </Typography>

                    <Box
                        sx={{
                            display: 'flex',
                            flexWrap: 'wrap',
                            gap: '1rem',
                        }}
                    >
                        <MobileDateTimePicker
                            ampm={false}
                            label={t('labels:startInscriptionDate')}
                            value={competitionState.startInscriptionDate}
                            onChange={(date) => {
                                if (!date) {
                                    setIsStartInscriptionDateValid(false);
                                    return;
                                }
                                setCompetitionState({
                                    ...competitionState,
                                    startInscriptionDate: date,
                                });
                            }}
                            onError={(error) =>
                                setIsStartInscriptionDateValid(!error)
                            }
                            format="dd/MM/yyyy HH:mm"
                            maxDate={competitionState.date}
                        />

                        <MobileDateTimePicker
                            ampm={false}
                            label={t('labels:endInscriptionDate')}
                            value={competitionState.endInscriptionDate}
                            onChange={(date) => {
                                if (!date) {
                                    setIsEndInscriptionDateValid(false);
                                    return;
                                }
                                setCompetitionState({
                                    ...competitionState,
                                    endInscriptionDate: date,
                                });
                            }}
                            onError={(error) =>
                                setIsEndInscriptionDateValid(!error)
                            }
                            format="dd/MM/yyyy HH:mm"
                            minDate={
                                competitionState.startInscriptionDate
                                    ? new Date(
                                          competitionState.startInscriptionDate.getTime() +
                                              24 * 60 * 60 * 1000
                                      )
                                    : undefined
                            }
                            maxDate={competitionState.date}
                        />
                    </Box>

                    <FormControl sx={{ minWidth: 200 }}>
                        <InputLabel id="allowedClubsLabel">
                            {t('labels:allowedClubs')}
                        </InputLabel>
                        <Select
                            id="allowedClubs"
                            labelId="allowedClubsLabel"
                            label={t('labels:allowedClubs')}
                            multiple
                            value={allowedClubsId}
                            onChange={(e) => {
                                const selectedClubs = e.target.value as Id[];
                                const allowedClubs =
                                    clubs?.filter((club) =>
                                        selectedClubs.includes(club.id)
                                    ) || [];
                                setCompetitionState({
                                    ...competitionState,
                                    allowedClubs: allowedClubs,
                                });
                            }}
                            renderValue={(selected) => (
                                <Box
                                    sx={{
                                        display: 'flex',
                                        flexWrap: 'wrap',
                                        gap: '0.5rem',
                                    }}
                                >
                                    {(selected as Id[]).map((id) => {
                                        const club = clubs?.find(
                                            (club) => club.id === id
                                        );
                                        return (
                                            <Chip
                                                key={id}
                                                label={club?.abbr}
                                                onDelete={() => {
                                                    const newAllowedClubs =
                                                        competitionState.allowedClubs.filter(
                                                            (club) =>
                                                                club.id !== id
                                                        );
                                                    setCompetitionState({
                                                        ...competitionState,
                                                        allowedClubs:
                                                            newAllowedClubs,
                                                    });
                                                }}
                                                onMouseDown={(e) =>
                                                    e.stopPropagation()
                                                }
                                            />
                                        );
                                    })}
                                </Box>
                            )}
                        >
                            {clubs
                                ?.sort((a, b) => a.abbr.localeCompare(b.abbr))
                                .map((club) => (
                                    <MenuItem key={club.id} value={club.id}>
                                        {club.abbr}
                                    </MenuItem>
                                ))}
                        </Select>
                    </FormControl>

                    <Box
                        sx={{
                            display: 'flex',
                            flexWrap: 'wrap',
                            gap: '1rem',
                        }}
                    >
                        <FormControl sx={{ minWidth: 120 }}>
                            <InputLabel id="methodLabel">
                                {t('labels:paymentMethod')}
                            </InputLabel>
                            <Select
                                id="method"
                                labelId="methodLabel"
                                label={t('labels:paymentMethod')}
                                value={competitionState.method}
                                onChange={(e) =>
                                    setCompetitionState({
                                        ...competitionState,
                                        method: e.target.value as PaymentMethod,
                                    })
                                }
                            >
                                <MenuItem value={PaymentMethod.FREE}>
                                    Free
                                </MenuItem>
                                <MenuItem value={PaymentMethod.ONLINE}>
                                    Online
                                </MenuItem>
                                <MenuItem value={PaymentMethod.ONPLACE}>
                                    On Place
                                </MenuItem>
                            </Select>
                        </FormControl>

                        {competitionState.method !== PaymentMethod.FREE && (
                            <FormControl sx={{ minWidth: 200 }}>
                                <InputLabel id="freeClubsLabel">
                                    {t('labels:freeClubs')}
                                </InputLabel>
                                <Select
                                    id="freeClubs"
                                    labelId="freeClubsLabel"
                                    label={t('labels:freeClubs')}
                                    multiple
                                    value={freeClubsId}
                                    onChange={(e) => {
                                        const selectedClubs = e.target
                                            .value as Id[];
                                        const freeClubs =
                                            clubs?.filter((club) =>
                                                selectedClubs.includes(club.id)
                                            ) || [];
                                        setCompetitionState({
                                            ...competitionState,
                                            freeClubs: freeClubs,
                                        });
                                    }}
                                    renderValue={(selected) => (
                                        <Box
                                            sx={{
                                                display: 'flex',
                                                flexWrap: 'wrap',
                                                gap: '0.5rem',
                                            }}
                                        >
                                            {(selected as Id[]).map((id) => {
                                                const club = clubs?.find(
                                                    (club) => club.id === id
                                                );
                                                return (
                                                    <Chip
                                                        key={id}
                                                        label={club?.abbr}
                                                        onDelete={() => {
                                                            const newFreeClubs =
                                                                competitionState.freeClubs.filter(
                                                                    (club) =>
                                                                        club.id !==
                                                                        id
                                                                );
                                                            setCompetitionState(
                                                                {
                                                                    ...competitionState,
                                                                    freeClubs:
                                                                        newFreeClubs,
                                                                }
                                                            );
                                                        }}
                                                        onMouseDown={(e) =>
                                                            e.stopPropagation()
                                                        }
                                                    />
                                                );
                                            })}
                                        </Box>
                                    )}
                                >
                                    {clubs
                                        ?.sort((a, b) =>
                                            a.abbr.localeCompare(b.abbr)
                                        )
                                        .map((club) => (
                                            <MenuItem
                                                key={club.id}
                                                value={club.id}
                                            >
                                                {club.abbr}
                                            </MenuItem>
                                        ))}
                                </Select>
                            </FormControl>
                        )}

                        {competitionState.method === PaymentMethod.ONLINE && (
                            <FormControl>
                                <FormLabel sx={{ textAlign: 'center' }}>
                                    {t('labels:isFeesAdditionnal')}
                                </FormLabel>
                                <Switch
                                    checked={competitionState.isFeesAdditionnal}
                                    onChange={() =>
                                        setCompetitionState({
                                            ...competitionState,
                                            isFeesAdditionnal:
                                                !competitionState.isFeesAdditionnal,
                                        })
                                    }
                                    sx={{ alignSelf: 'center' }}
                                />
                            </FormControl>
                        )}
                    </Box>

                    <FormControl sx={{ minWidth: 200 }}>
                        <InputLabel id="oneDayPermissionsLabel">
                            {t('labels:oneDayPermission')}
                        </InputLabel>

                        <Select
                            id="oneDayPermissions"
                            labelId="oneDayPermissionsLabel"
                            label={t('labels:oneDayPermission')}
                            multiple
                            value={competitionState.oneDayPermissions}
                            onChange={(e) => {
                                const selectedPermissions = e.target.value as OneDayPermission[];
                                setCompetitionState({
                                    ...competitionState,
                                    oneDayPermissions: selectedPermissions,
                                });
                            }}
                            renderValue={(selected) => (
                                <Box
                                    sx={{
                                        display: 'flex',
                                        flexWrap: 'wrap',
                                        gap: '0.5rem',
                                    }}
                                >
                                    {(selected as OneDayPermission[]).map((permission) => (
                                        <Chip
                                            key={permission}
                                            label={t(
                                                `labels:${permission}`
                                            )}
                                            onDelete={() => {
                                                const newPermissions =
                                                    competitionState.oneDayPermissions.filter(
                                                        (perm) =>
                                                            perm !==
                                                            permission
                                                    );
                                                setCompetitionState({
                                                    ...competitionState,
                                                    oneDayPermissions:
                                                        newPermissions,
                                                });
                                            }}
                                            onMouseDown={(e) =>
                                                e.stopPropagation()
                                            }
                                        />
                                    ))}
                                </Box>
                            )}
                        >
                            {Object.values(OneDayPermission).map((permission) => (
                                <MenuItem key={permission} value={permission}>
                                    {t(`labels:${permission}`)}
                                </MenuItem>
                            ))}
                        </Select>
                    </FormControl>

                    <TextFieldWith$
                        id="maxEventByAthlete"
                        label={{ value: t('labels:maxEventByAthlete') }}
                        value={{
                            value:
                                competitionState.maxEventByAthlete?.toString() ||
                                '',
                            onChange: (value) => {
                                const { success, data } =
                                    Competition$.shape.maxEventByAthlete.safeParse(
                                        value
                                    );
                                if (success) {
                                    setCompetitionState({
                                        ...competitionState,
                                        maxEventByAthlete: data,
                                    });
                                }
                            },
                        }}
                        validator={{
                            Schema$: Competition$.shape.maxEventByAthlete,
                            isValid: isMaxEventByAthleteValid,
                            setIsValid: setIsMaxEventByAthleteValid,
                        }}
                        type="number"
                        formControlProps={{ sx: { maxWidth: 200 } }}
                    />
                </Box>
            </Box>
        </MaxWidth>
    );
};
