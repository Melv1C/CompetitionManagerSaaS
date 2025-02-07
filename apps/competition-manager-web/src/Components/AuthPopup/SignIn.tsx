import { useEffect, useState } from "react";
import { isAxiosError } from "axios";
import { Email$, Password$ } from "@competition-manager/schemas";

import { Alert, Box, Button, Divider, Link, Typography } from "@mui/material";

import { login } from "../../api";

import { decodeToken } from "../../utils/decodeToken";
import { PasswordFieldWith$, TextFieldWith$ } from "../FieldsWithSchema";
import { useSetAtom } from "jotai";
import { userTokenAtom } from "../../GlobalsStates";
import { useTranslation } from "react-i18next";
import { ForgotPasswordPopup } from "./ForgotPasswordPopup";
import { useQuery } from "react-query";

type SignInProps = {
    onToggle: () => void;
};

export const SignIn: React.FC<SignInProps> = ({ onToggle }) => {

    const { t } = useTranslation('auth');

    const setUserToken = useSetAtom(userTokenAtom);

    const [email, setEmail] = useState('');
    const [isEmailValid, setIsEmailValid] = useState(true);
    const [password, setPassword] = useState('');
    const [isPasswordValid, setIsPasswordValid] = useState(true);

    const isFormValid = isEmailValid && isPasswordValid;
    const [errorMsg, setErrorMsg] = useState('');

    const [isForgotPasswordPopupVisible, setIsForgotPasswordPopupVisible] = useState(false);

    const { data, isLoading, isError, error, refetch } = useQuery('login', async () => {
        return await login(email, password);
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
            <Typography 
                variant="h4"
                color="text.primary"
                sx={{ textAlign: 'center' }}
            >
                {t('login')}
            </Typography>

            <Box 
                component="form"
                sx={{ 
                    display: 'flex', 
                    flexDirection: 'column', 
                    gap: '1rem', 
                    margin: '1rem 0'
                }}
                onSubmit={async (e) => {
                    e.preventDefault();
                    if (!isFormValid) {
                        setErrorMsg(t('error.invalidForm'));
                        return;
                    }

                    refetch();
                }}
            >
                <TextFieldWith$ 
                    id="email" 
                    label={{ value: t('email'), hasExtrenLabel: true }}
                    value={{ value: email, onChange: (value) => setEmail(value) }}
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

                <Button 
                    variant="contained" 
                    color="primary"
                    type="submit"
                    disabled={isLoading}
                >
                    {t('login')}
                </Button>

                {isError && isAxiosError(error) && (
                    <Alert severity="error">{t(`errors:users-api.${error.response?.data.error}`)}</Alert>
                )}

                {errorMsg && (
                    <Alert severity="error">{errorMsg}</Alert>
                )}

                <Link sx={{ textAlign: 'center', cursor: 'pointer' }} onClick={() => setIsForgotPasswordPopupVisible(true)}>
                    {t('forgotPassword')}
                </Link>

                {isForgotPasswordPopupVisible && (
                    <ForgotPasswordPopup onClose={() => setIsForgotPasswordPopupVisible(false)} />
                )}
            </Box>

            <Divider>
                <Typography
                    variant="body1"
                    color="text.secondary"
                >
                    {t('or')}
                </Typography>
            </Divider>

            <Typography 
                variant="body1"
                color="text.primary"
                sx={{ textAlign: 'center' }}
            >
                {t('noAccount')}{' '}
                <Link onClick={onToggle} sx={{ cursor: 'pointer' }}>
                    {t('register')}
                </Link>
            </Typography>
        </>
    );
}