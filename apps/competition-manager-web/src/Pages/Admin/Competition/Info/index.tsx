import { Box, Chip, Divider, FormControl, FormLabel, InputLabel, MenuItem, Select, Switch, Typography } from "@mui/material";
import { useAtom } from "jotai";
import { competitionAtom } from "../../../../GlobalsStates";
import { useEffect, useMemo, useState } from "react";
import { Loading, WysiwygEditor } from "../../../../Components";
import { MaxWidth } from "../../../../Components/MaxWidth";
import { TextFieldWith$ } from "../../../../Components/FieldsWithSchema";
import { Competition, Competition$, Id, PaymentMethod, UpdateCompetition } from "@competition-manager/schemas";
import { CircleButton } from "../../../../Components/CircleButton";
import { Save } from "../../../../Components/Icons";
import { MobileDatePicker, MobileDateTimePicker } from "@mui/x-date-pickers";
import { useBlocker } from "react-router-dom";
import { OnLeavePopup } from "./OnLeavePopup";
import { updateCompetition } from "../../../../api";
import { useQuery } from "react-query";
import { getClubs } from "../../../../api";
import { useTranslation } from "react-i18next";

export const Info = () => {

    const { t } = useTranslation();

    const { data: clubs } = useQuery('clubs', getClubs);

    const [competition, setCompetition] = useAtom(competitionAtom);
    const [competitionState, setCompetitionState] = useState<Competition>();
    const clubsId = useMemo(() => competitionState?.freeClubs.map((club) => club.id) || [], [competitionState]);

    const [isNameValid, setIsNameValid] = useState(true);
    const [isDateValid, setIsDateValid] = useState(true);
    const [isCloseDateValid, setIsCloseDateValid] = useState(true);
    const [isEmailValid, setIsEmailValid] = useState(true);
    const [isStartInscriptionDateValid, setIsStartInscriptionDateValid] = useState(true);
    const [isEndInscriptionDateValid, setIsEndInscriptionDateValid] = useState(true);


    const [isMultiDay, setIsMultiDay] = useState(competition?.closeDate !== null);

    const isModified = useMemo(() => (
        JSON.stringify(competition) !== JSON.stringify(competitionState)
    ), [competition, competitionState]);
    
    const isFormValid = useMemo(() => (
        isNameValid && isDateValid && (isMultiDay ? isCloseDateValid : true) && isEmailValid && isStartInscriptionDateValid && isEndInscriptionDateValid
    ), [isNameValid, isDateValid, isMultiDay, isCloseDateValid, isEmailValid, isStartInscriptionDateValid, isEndInscriptionDateValid]);
    
    const isSaveEnabled = useMemo(() => isFormValid && isModified, [isFormValid, isModified]);

    useEffect(() => {
        if (competition && (!competitionState || competition.eid !== competitionState.eid)) {
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
                allowedClubsId: competitionState.allowedClubs.map((club) => club.id),
            }
            
            updateCompetition(competitionState.eid, updateCompetiton)
                .then((newCompetition) => {
                    setCompetition(newCompetition);
                    setCompetitionState(newCompetition);
                })
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
        return <Loading />
    }

    return (
        <MaxWidth>
            {isBlock && <OnLeavePopup onStay={handleStay} onLeave={handleLeave} />}
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
                        <FormLabel
                            sx={{ textAlign: 'center' }}
                        >
                            {t('labels:publish')}
                        </FormLabel>
                        <Switch
                            checked={competitionState.publish}
                            onChange={() => setCompetitionState({ ...competitionState, publish: !competitionState.publish })}
                            sx={{ alignSelf: 'center' }}
                        />
                    </FormControl>

                    <TextFieldWith$
                        id="name"
                        label={{ value: t('labels:name') }}
                        value={{ value: competitionState.name, onChange: (value) => setCompetitionState({ ...competitionState, name: value }) }}
                        validator={{ Schema$: Competition$.shape.name, isValid: isNameValid, setIsValid: setIsNameValid }}
                        formControlProps={{ fullWidth: true }}
                    />

                    <CircleButton
                        onClick={onSave}
                        variant="contained"
                        color="success"
                        disabled={!isSaveEnabled}
                    >
                        <Save size="xl" />
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
                            label={isMultiDay ? t('labels:start_date') : t('labels:date')}
                            value={competitionState.date}
                            onChange={(date) => {
                                if (!date) {
                                    setIsDateValid(false);
                                    return;
                                }
                                setCompetitionState({ ...competitionState, date: date })
                            }}
                            onError={(error) => setIsDateValid(!error)}
                            format="dd/MM/yyyy"
                            slotProps={{ textField: { required: true } }}
                        />
                    
                        <FormControl>
                            <FormLabel
                                sx={{ textAlign: 'center' }}
                            >
                                {t('labels:multi_day')}
                            </FormLabel>
                            <Switch
                                checked={isMultiDay}
                                onChange={() => {
                                    setIsMultiDay(prev => !prev)
                                    setCompetitionState({ ...competitionState, closeDate: null });
                                    setIsCloseDateValid(true)
                                }}
                                sx={{ alignSelf: 'center' }}
                            />
                        </FormControl>

                        {isMultiDay && 
                            <MobileDatePicker
                                label={t('labels:end_date')}
                                value={competitionState.closeDate}
                                onChange={(date) => setCompetitionState({ ...competitionState, closeDate: date })} 
                                onError={(error) => setIsCloseDateValid(!error)}
                                format="dd/MM/yyyy"
                                minDate={competitionState.date ? new Date(competitionState.date.getTime() + 24 * 60 * 60 * 1000) : undefined}
                                slotProps={{ textField: { required: true } }}
                            />
                        }
                    </Box>

                    <WysiwygEditor
                        value={competitionState.description}
                        onChange={(value) => setCompetitionState({ ...competitionState, description: value })}
                        placeholder={t('labels:description')}
                    />

                    <Divider />

                    <Typography variant="h6">{t('adminCompetition:contactInformation')}</Typography>

                    <TextFieldWith$
                        id="contactEmail"
                        label={{ value: t('labels:contactEmail') }}
                        value={{ value: competitionState.email, onChange: (value) => setCompetitionState({ ...competitionState, email: value }) }}
                        validator={{ Schema$: Competition$.shape.email, isValid: isEmailValid, setIsValid: setIsEmailValid }}
                    />

                    <Divider />

                    <Typography variant="h6">{t('adminCompetition:inscriptionInformation')}</Typography>

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
                                setCompetitionState({ ...competitionState, startInscriptionDate: date })
                            }}
                            onError={(error) => setIsStartInscriptionDateValid(!error)}
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
                                setCompetitionState({ ...competitionState, endInscriptionDate: date })
                            }}
                            onError={(error) => setIsEndInscriptionDateValid(!error)}
                            format="dd/MM/yyyy HH:mm"
                            minDate={competitionState.startInscriptionDate ? new Date(competitionState.startInscriptionDate.getTime() + 24 * 60 * 60 * 1000) : undefined}
                            maxDate={competitionState.date}
                        />
                    </Box>  

                    <Box
                        sx={{
                            display: 'flex',
                            flexWrap: 'wrap',
                            gap: '1rem',
                        }}
                    >

                        <FormControl sx={{ minWidth: 120 }}>
                            <InputLabel id="methodLabel">{t('labels:paymentMethod')}</InputLabel>
                            <Select
                                id="method"
                                labelId="methodLabel"
                                label="Payment Method"
                                value={competitionState.method}
                                onChange={(e) => setCompetitionState({ ...competitionState, method: e.target.value as PaymentMethod })}
                            >
                                <MenuItem value={PaymentMethod.FREE}>Free</MenuItem>
                                <MenuItem value={PaymentMethod.ONLINE}>Online</MenuItem>
                                <MenuItem value={PaymentMethod.ONPLACE}>On Place</MenuItem>
                            </Select>
                        </FormControl>

                        {competitionState.method !== PaymentMethod.FREE &&
                            <FormControl sx={{ minWidth: 120 }}>
                                <InputLabel id="freeClubsLabel">{t('labels:freeClubs')}</InputLabel>
                                <Select
                                    id="freeClubs"
                                    labelId="freeClubsLabel"
                                    label="Free Clubs"
                                    multiple
                                    value={clubsId}
                                    onChange={(e) => {
                                        const selectedClubs = e.target.value as Id[];
                                        const freeClubs = clubs?.filter((club) => selectedClubs.includes(club.id)) || [];
                                        setCompetitionState({ ...competitionState, freeClubs: freeClubs })
                                    }}
                                    renderValue={(selected) => (
                                        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
                                            {(selected as Id[]).map((id) => {
                                                const club = clubs?.find((club) => club.id === id);
                                                return (
                                                    <Chip key={id} label={club?.abbr} />
                                                )
                                            })}
                                        </Box>
                                    )}
                                >
                                    {clubs?.map((club) => (
                                        <MenuItem key={club.id} value={club.id}>
                                            {club.abbr}
                                        </MenuItem>
                                    ))}
                                </Select>
                            </FormControl>
                        }
                    </Box>
                </Box>
            </Box>
        </MaxWidth>
    )
}