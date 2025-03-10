import { Email$, Password$ } from '@competition-manager/schemas';
import { isAxiosError } from 'axios';
import { useState } from 'react';

import { Alert, Box, Button, Divider, Link, Typography } from '@mui/material';

import { login } from '@/api';

import { userTokenAtom } from '@/GlobalsStates';
import { useSetAtom } from 'jotai';
import { useTranslation } from 'react-i18next';
import { useMutation } from 'react-query';
import { decodeToken } from '../../utils/decodeToken';
import { PasswordFieldWith$ } from '../FieldsWithSchema/PasswordFieldWith$';
import { TextFieldWith$ } from '../FieldsWithSchema/TextFieldWith$';
import { ForgotPasswordPopup } from './ForgotPasswordPopup';

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

    const [isForgotPasswordPopupVisible, setIsForgotPasswordPopupVisible] =
        useState(false);

    const mutation = useMutation(
        (data: { email: string; password: string }) =>
            login(data.email, data.password),
        {
            onSuccess: (data) => {
                setUserToken(decodeToken(data));
            },
        }
    );

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
                    margin: '1rem 0',
                }}
                onSubmit={(e) => {
                    e.preventDefault();
                    if (!isFormValid) {
                        setErrorMsg(t('error.invalidForm'));
                        return;
                    }

                    setErrorMsg('');

                    mutation.mutate({ email, password });
                }}
            >
                <TextFieldWith$
                    id="email"
                    label={{ value: t('email'), hasExtrenLabel: true }}
                    value={{
                        value: email,
                        onChange: (value) => setEmail(value),
                    }}
                    validator={{
                        Schema$: Email$,
                        isValid: isEmailValid,
                        setIsValid: setIsEmailValid,
                    }}
                    required
                />

                <PasswordFieldWith$
                    id="password"
                    label={{ value: t('password'), hasExtrenLabel: true }}
                    value={{ value: password, onChange: setPassword }}
                    validator={{
                        Schema$: Password$,
                        isValid: isPasswordValid,
                        setIsValid: setIsPasswordValid,
                    }}
                    required
                />

                <Button
                    variant="contained"
                    color="primary"
                    type="submit"
                    disabled={mutation.isLoading}
                >
                    {t('login')}
                </Button>

                {mutation.isError && isAxiosError(mutation.error) && (
                    <Alert severity="error">
                        {mutation.error.response?.data}
                    </Alert>
                )}

                {errorMsg && <Alert severity="error">{errorMsg}</Alert>}

                <Link
                    sx={{ textAlign: 'center', cursor: 'pointer' }}
                    onClick={() => setIsForgotPasswordPopupVisible(true)}
                >
                    {t('forgotPassword')}
                </Link>

                {isForgotPasswordPopupVisible && (
                    <ForgotPasswordPopup
                        onClose={() => setIsForgotPasswordPopupVisible(false)}
                    />
                )}
            </Box>

            <Divider>
                <Typography variant="body1" color="text.secondary">
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
};
