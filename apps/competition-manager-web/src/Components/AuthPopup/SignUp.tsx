import { useState } from "react";
import {isAxiosError} from "axios";
import { UserEmail$, UserPassword$ } from "@competition-manager/schemas";

import { Alert, Box, Button, Divider, Link, Typography } from "@mui/material";

import { useUserToken } from "../../GlobalsStates/userToken";
import { register } from "../../utils/auth";

import { Field } from "./Field";

type SignUpProps = {
    onToggle: () => void;
};

export const SignUp: React.FC<SignUpProps> = ({ onToggle }) => {

    const [, setUserToken] = useUserToken();

    const [email, setEmail] = useState('');
    const [isEmailValid, setIsEmailValid] = useState(true);
    const [password, setPassword] = useState('');
    const [isPasswordValid, setIsPasswordValid] = useState(true);
    const [confirmPassword, setConfirmPassword] = useState('');
    const [isConfirmPasswordValid, setIsConfirmPasswordValid] = useState(true);

    const isFormValid = isEmailValid && isPasswordValid && isConfirmPasswordValid;
    const [errorMsg, setErrorMsg] = useState('');

    return (
        <>
            <Typography variant="h4" sx={{ textAlign: 'center' }}>Sign Up</Typography>

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
                        setErrorMsg('Please fill out the form correctly');
                        return;
                    }

                    if (password !== confirmPassword) {
                        setErrorMsg('Passwords do not match');
                        return;
                    }

                    try {
                        const data = await register(email, password);
                        setUserToken(data);
                    } catch (error) {
                        console.error('Sign up error:', error);
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
                    label="Email" 
                    value={{ value: email, onChange: setEmail }} 
                    validator={{ Schema$: UserEmail$, isValid: isEmailValid, setIsValid: setIsEmailValid }} 
                />

                <Field 
                    id="password" 
                    label="Password" 
                    isPassword 
                    value={{ value: password, onChange: setPassword }} 
                    validator={{ Schema$: UserPassword$, isValid: isPasswordValid, setIsValid: setIsPasswordValid }}
                />

                <Field
                    id="confirmPassword"
                    label="Confirm Password"
                    isPassword
                    value={{ value: confirmPassword, onChange: setConfirmPassword }}
                    validator={{ Schema$: UserPassword$, isValid: isConfirmPasswordValid, setIsValid: setIsConfirmPasswordValid }}
                />

                <Button 
                    variant="contained" 
                    color="primary"
                    type="submit"
                >
                    Sign Up
                </Button>

                {errorMsg && (
                    <Alert severity="error">{errorMsg}</Alert>
                )}

            </Box>

            <Divider>or</Divider>

            <Typography sx={{ textAlign: 'center' }}>
                Already have an account? {' '}
                <Link onClick={onToggle} sx={{ cursor: 'pointer' }}>
                    Sign In
                </Link>
            </Typography>
        </>
    );
}