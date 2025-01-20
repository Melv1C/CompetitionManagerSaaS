import { useState } from "react";
import { isAxiosError } from "axios";
import { Email$, UserPassword$ } from "@competition-manager/schemas";

import { Alert, Box, Button, Divider, Link, Typography } from "@mui/material";

import { login } from "../../api";

import { decodeToken } from "../../utils/decodeToken";
import { PasswordFieldWith$, TextFieldWith$ } from "../FieldsWithSchema";
import { useSetAtom } from "jotai";
import { userTokenAtom } from "../../GlobalsStates";
import { useTranslation } from "react-i18next";

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

                    try {
                        const data = await login(email, password);
                        setUserToken(decodeToken(data));
                    } catch (error) {
                        console.error('Sign in error:', error);
                        if (isAxiosError(error) && error.response) {
                            setErrorMsg(error.response.data.message);
                        } else {
                            setErrorMsg(t('error.unknown'));
                        }
                    }
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
                    validator={{ Schema$: UserPassword$, isValid: isPasswordValid, setIsValid: setIsPasswordValid }}
                    required
                />

                <Button 
                    variant="contained" 
                    color="primary"
                    type="submit"
                >
                    {t('login')}
                </Button>

                {errorMsg && (
                    <Alert severity="error">{errorMsg}</Alert>
                )}

                <Link href="#" sx={{ textAlign: 'center' }}>{t('forgotPassword')}</Link>

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