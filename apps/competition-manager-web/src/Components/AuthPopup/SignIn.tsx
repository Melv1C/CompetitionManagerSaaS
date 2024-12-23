import { useState } from "react";
import { isAxiosError } from "axios";
import { UserEmail$, UserPassword$ } from "@competition-manager/schemas";

import { Alert, Box, Button, Divider, Link, Typography } from "@mui/material";

import { useUserToken } from "../../GlobalsStates/userToken";
import { login } from "../../utils/requests";

import { TextFieldWithSchema as Field } from "../../Components/TextFieldWithSchema";
import { decodeToken } from "../../utils/decodeToken";

type SignInProps = {
    onToggle: () => void;
};

export const SignIn: React.FC<SignInProps> = ({ onToggle }) => {

    const [, setUserToken] = useUserToken();

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
                Sign In
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
                        setErrorMsg('Please fill out the form correctly');
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
                            setErrorMsg('An unknown error occurred');
                        }
                    }
                }}
            >
                <Field 
                    id="email" 
                    label={{ value: 'Email', hasExtrenLabel: true }}
                    value={{ value: email, onChange: setEmail }} 
                    validator={{ Schema$: UserEmail$, isValid: isEmailValid, setIsValid: setIsEmailValid }} 
                    required
                />

                <Field 
                    id="password" 
                    label={{ value: 'Password', hasExtrenLabel: true }}
                    value={{ value: password, onChange: setPassword }} 
                    validator={{ Schema$: UserPassword$, isValid: isPasswordValid, setIsValid: setIsPasswordValid }}
                    isPassword
                    required
                />

                <Button 
                    variant="contained" 
                    color="primary"
                    type="submit"
                >
                    Sign In
                </Button>

                {errorMsg && (
                    <Alert severity="error">{errorMsg}</Alert>
                )}

                <Link href="#" sx={{ textAlign: 'center' }}>Forgot password?</Link>

            </Box>

            <Divider>
                <Typography
                    variant="body1"
                    color="text.secondary"
                >
                    or
                </Typography>
            </Divider>

            <Typography 
                variant="body1"
                color="text.primary"
                sx={{ textAlign: 'center' }}
            >
                Don't have an account? {' '}
                <Link onClick={onToggle} sx={{ cursor: 'pointer' }}>
                    Sign Up
                </Link>
            </Typography>
        </>
    );
}