import { useEffect, useState } from "react";
import {isAxiosError} from "axios";
import { Email$, Password$ } from "@competition-manager/schemas";

import { Alert, Box, Button, Divider, Link, Typography } from "@mui/material";

import { register } from "../../api";


import { decodeToken } from "../../utils/decodeToken";
import { PasswordFieldWith$, TextFieldWith$ } from "../FieldsWithSchema";
import { useSetAtom } from "jotai";
import { userTokenAtom } from "../../GlobalsStates";
import { useTranslation } from "react-i18next";
import { useQuery } from "react-query";

type SignUpProps = {
    onToggle: () => void;
};

export const SignUp: React.FC<SignUpProps> = ({ onToggle }) => {
    const { t } = useTranslation('auth');

    const setUserToken = useSetAtom(userTokenAtom);

    const [email, setEmail] = useState('');
    const [isEmailValid, setIsEmailValid] = useState(true);
    const [password, setPassword] = useState('');
    const [isPasswordValid, setIsPasswordValid] = useState(true);
    const [confirmPassword, setConfirmPassword] = useState('');
    const [isConfirmPasswordValid, setIsConfirmPasswordValid] = useState(true);

    const isFormValid = isEmailValid && isPasswordValid && isConfirmPasswordValid;
    const [errorMsg, setErrorMsg] = useState('');

    const { data, isLoading, isError, error, refetch } = useQuery('register', async () => {
        return await register(email, password);
    }, {
        enabled: false,
        retry: false
    });

    useEffect(() => {
        if (data) {
            const userToken = decodeToken(data);
            setUserToken(userToken);
        }
    }, [data, setUserToken]);

    return (
        <>
            <Typography variant="h4" sx={{ textAlign: 'center' }}>
                {t('register')}
            </Typography>

            <Box 
                component="form"
                sx={{ 
                    display: 'flex', 
                    flexDirection: 'column', 
                    gap: '1rem', 
                    margin: '1rem'
                }}
                onSubmit={async (e) => {
                    e.preventDefault();
                    if (!isFormValid) {
                        setErrorMsg(t('error.invalidForm'));
                        return;
                    }

                    if (password !== confirmPassword) {
                        setErrorMsg(t('error.passwordMismatch'));
                        return;
                    }   

                    await refetch();
                }}
            >
                <TextFieldWith$ 
                    id="email" 
                    label={{ value: t('email') , hasExtrenLabel: true}}
                    value={{ value: email, onChange: setEmail }} 
                    validator={{ Schema$: Email$, isValid: isEmailValid, setIsValid: setIsEmailValid }} 
                    required
                />

                <PasswordFieldWith$ 
                    id="password" 
                    label={{ value: t('password'), hasExtrenLabel: true }}
                    value={{ value: password, onChange: setPassword }} 
                    validator={{ Schema$: Password$, isValid: isPasswordValid, setIsValid: setIsPasswordValid }}
                    required
                />

                <PasswordFieldWith$
                    id="confirmPassword"
                    label={{ value: t('confirmPassword'), hasExtrenLabel: true }}
                    value={{ value: confirmPassword, onChange: setConfirmPassword }}
                    validator={{ Schema$: Password$, isValid: isConfirmPasswordValid, setIsValid: setIsConfirmPasswordValid }}
                    required
                />

                <Button 
                    variant="contained" 
                    color="primary"
                    type="submit"
                    loading={isLoading}
                >
                    {t('register')}
                </Button>

                {isError && isAxiosError(error) && (
                    <Alert severity="error">{t(`errors:users-api.${error.response?.data.error}`)}</Alert>
                )}

                {errorMsg && (
                    <Alert severity="error">{errorMsg}</Alert>
                )}

            </Box>

            <Divider>{t('or')}</Divider>

            <Typography sx={{ textAlign: 'center' }}>
                {t('alreadyHaveAccount')}{' '}
                <Link onClick={onToggle} sx={{ cursor: 'pointer' }}>
                    {t('login')}
                </Link>
            </Typography>
        </>
    );
}