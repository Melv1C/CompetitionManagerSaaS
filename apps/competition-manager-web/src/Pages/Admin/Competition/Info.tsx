import { Box, Chip, Divider, FormControl, FormLabel, InputLabel, MenuItem, Select, Switch, Typography } from "@mui/material";
import { useAtomValue } from "jotai";
import { competitionAtom } from "../../../GlobalsStates";
import { useEffect, useState } from "react";
import { Loading } from "../../../Components";
import { MaxWidth } from "../../../Components/MaxWidth";
import { TextFieldWith$ } from "../../../Components/FieldsWithSchema";
import { Club, Competition, Competition$, PaymentMethod } from "@competition-manager/schemas";
import { CircleButton } from "../../../Components/CircleButton";
import { Save } from "../../../Components/Icons";
import { DatePicker } from "@mui/x-date-pickers";
import { useBlocker } from "react-router-dom";

export const Info = () => {
    const competition = useAtomValue(competitionAtom);
    const [competitionState, setCompetitionState] = useState<Competition>();
    const [clubs] = useState<Club[]>([]);

    const [isNameValid, setIsNameValid] = useState(true);
    const [isDescriptionValid, setIsDescriptionValid] = useState(true);
    const [isDateValid, setIsDateValid] = useState(true);
    const [isCloseDateValid, setIsCloseDateValid] = useState(true);
    const [isEmailValid, setIsEmailValid] = useState(true);

    const [isMultiDay, setIsMultiDay] = useState(competition?.closeDate !== null);

    const isFormValid = isNameValid && isDescriptionValid && isDateValid && (isMultiDay ? isCloseDateValid : true) && isEmailValid;

    const isSaveDisabled = !isFormValid || JSON.stringify(competition) === JSON.stringify(competitionState);

    const blocker = useBlocker(!isSaveDisabled);

    useEffect(() => {
        if (blocker.state === 'blocked') {
            const response = window.confirm('You have unsaved changes, are you sure you want to leave?');
            if (response) {
                blocker.proceed!();
                
            }
        }

        return () => {
            if (blocker.state === 'blocked') {
                blocker.reset();
            }
        }
    }, [blocker])

    useEffect(() => {
        if (!isSaveDisabled) {
          window.onbeforeunload = () => true;
        }
    
        return () => {
          window.onbeforeunload = null;
        };
      }, [isSaveDisabled]);

    useEffect(() => {
        if (competition && !competitionState) {
            setCompetitionState(competition);
            setIsMultiDay(competition.closeDate !== null);
        }
    }, [competition]);

    if (!competitionState) {
        return <Loading />
    }

    return (
        <MaxWidth>
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
                            Publish
                        </FormLabel>
                        <Switch
                            checked={competitionState.publish}
                            onChange={() => setCompetitionState({ ...competitionState, publish: !competitionState.publish })}
                            sx={{ alignSelf: 'center' }}
                        />
                    </FormControl>

                    <TextFieldWith$
                        id="name"
                        label={{ value: "Name" }}
                        value={{ value: competitionState.name, onChange: (value) => setCompetitionState({ ...competitionState, name: value }) }}
                        validator={{ Schema$: Competition$.shape.name, isValid: isNameValid, setIsValid: setIsNameValid }}
                        formControlProps={{ fullWidth: true }}
                    />

                    <CircleButton
                        onClick={() => { }}
                        variant="contained"
                        color="success"
                        disabled={isSaveDisabled}
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

                        <DatePicker
                            label={isMultiDay ? 'Start Date' : 'Date'}
                            value={competitionState.date}
                            onChange={(date) => setCompetitionState({ ...competitionState, date: date || new Date() })}
                            onError={(error) => setIsDateValid(!error)}
                            format="dd/MM/yyyy"
                            disablePast
                            slotProps={{ textField: { required: true } }}
                        />
                    
                        <FormControl>
                            <FormLabel
                                sx={{ textAlign: 'center' }}
                            >
                                Multi Day
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
                            <DatePicker
                                label="Close Date"
                                value={competitionState.closeDate}
                                onChange={(date) => setCompetitionState({ ...competitionState, closeDate: date || undefined })}
                                onError={(error) => setIsCloseDateValid(!error)}
                                format="dd/MM/yyyy"
                                disablePast
                                minDate={competitionState.date ? new Date(competitionState.date.getTime() + 24 * 60 * 60 * 1000) : undefined}
                                slotProps={{ textField: { required: true } }}
                            />
                        }
                    </Box>

                    <TextFieldWith$
                        id="description"
                        label={{ value: "Description" }}
                        value={{ value: competitionState.description, onChange: (value) => setCompetitionState({ ...competitionState, description: value }) }}
                        validator={{ Schema$: Competition$.shape.description, isValid: isDescriptionValid, setIsValid: setIsDescriptionValid }}
                        multiline
                    />

                    <Divider />

                    <Typography variant="h6">Contact Information</Typography>

                    <TextFieldWith$
                        id="email"
                        label={{ value: "Contact Email" }}
                        value={{ value: competitionState.email, onChange: (value) => setCompetitionState({ ...competitionState, email: value }) }}
                        validator={{ Schema$: Competition$.shape.email, isValid: isEmailValid, setIsValid: setIsEmailValid }}
                    />

                    <Divider />

                    <Typography variant="h6">Inscription Information</Typography>

                    <Box
                        sx={{
                            display: 'flex',
                            flexWrap: 'wrap',
                            gap: '1rem',
                        }}
                    >
                        <DatePicker
                            label="Start Inscription Date"
                            value={competitionState.startInscriptionDate}
                            onChange={(date) => setCompetitionState({ ...competitionState, startInscriptionDate: date || undefined })}
                            //onError={(error) => setIsDateValid(!error)}
                            format="dd/MM/yyyy"
                            disablePast
                        />

                        <DatePicker
                            label="End Inscription Date"
                            value={competitionState.endInscriptionDate}
                            onChange={(date) => setCompetitionState({ ...competitionState, endInscriptionDate: date || undefined })}
                            //onError={(error) => setIsDateValid(!error)}
                            format="dd/MM/yyyy"
                            disablePast
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
                            <InputLabel id="methodLabel">Payment Method</InputLabel>
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
                                <InputLabel id="freeClubsLabel">Free Clubs</InputLabel>
                                <Select
                                    id="freeClubs"
                                    labelId="freeClubsLabel"
                                    label="Free Clubs"
                                    multiple
                                    value={competitionState.freeClubs}
                                    onChange={(e) => setCompetitionState({ ...competitionState, freeClubs: e.target.value as Club[] })}
                                    renderValue={(selected) => (
                                        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
                                            {selected.map((value) => (
                                                <Chip key={value.id} label={value.name} />
                                            ))}
                                        </Box>
                                    )}
                                >
                                    {clubs.map((option) => (
                                        <MenuItem key={option.id} value={option.id}>
                                            {option.name}
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


/*
{
    "id": 5,
    "eid": "23b0bb8a-4a00-4869-9b22-821f42176757",
    "name": "Tournoi des jeunes",
    "date": "2025-01-21T23:00:00.000Z",
    "description": "",
    "events": [],
    "publish": false,
    "method": "free",
    "paymentPlan": {
        "id": 1,
        "name": "Basic",
        "description": "",
        "includedOptions": [],
        "price": 1
    },
    "options": [
        {
            "id": 1,
            "name": "Live result",
            "description": "",
            "price": 2
        }
    ],
    "startInscriptionDate": null,
    "endInscriptionDate": null,
    "admins": [
        {
            "id": 5,
            "user": {
                "id": 1,
                "email": "claes.melvyn@gmail.com",
                "role": "superadmin"
            },
            "userId": 1,
            "competitionId": 5,
            "access": [
                "owner"
            ]
        }
    ],
    "email": "claes.melvyn@gmail.com",
    "closeDate": null,
    "freeClubs": [],
    "oneDayPermissions": [],
    "oneDayBibStart": 9900
}
    */
