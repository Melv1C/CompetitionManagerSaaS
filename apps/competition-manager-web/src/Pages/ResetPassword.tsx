
import { useTranslation } from "react-i18next"
import { MaxWidth, PasswordFieldWith$ } from "../Components"
import { useSearchParams } from "react-router-dom"
import { jwtDecode } from "jwt-decode"
import { Alert, Box, Button, FormControl, FormLabel, TextField, Typography } from "@mui/material"
import { useState } from "react"
import { TokenData$, Password$ } from "@competition-manager/schemas"
import { resetPassword } from "../api"


export const ResetPassword = () => {

    const { t } = useTranslation('auth')
    const [searchParams] = useSearchParams()

    const token = searchParams.get('token')
    if (!token) throw new Error('No token provided')
    const decoedToken = jwtDecode(token)
    if (!decoedToken) throw new Error('Invalid token')
    const isTokenValid = decoedToken.exp! * 1000 > Date.now()

    const email = TokenData$.parse(decoedToken).email
    const [password, setPassword] = useState('')
    const [isPasswordValid, setIsPasswordValid] = useState(true)
    const [confirmPassword, setConfirmPassword] = useState('')
    const [isConfirmPasswordValid, setIsConfirmPasswordValid] = useState(true)

    const isFormValid = isPasswordValid && isConfirmPasswordValid && password !== '' && confirmPassword !== ''
    const [errorMsg, setErrorMsg] = useState('')

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
       
        // compare password and confirmPassword
        if (password !== confirmPassword) {
            setErrorMsg(t('error.passwordMismatch'))
            return
        }

        // send request to the server
        try {
            // send request to the server
            const data = await resetPassword(password, token)
            console.log(data) // TODO: handle response
        } catch (error) {
            console.error(error)
            setErrorMsg(t('error.unknown')) // TODO: better error handling
        }
    }


    return (
        <MaxWidth>
            <Box 
                sx={{
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'center',
                    alignItems: 'center',
                    gap: '1rem',
                }}
            >
                <Typography variant="h4">
                    {t('resetPassword.title')}
                </Typography>
                
                {isTokenValid ? (
                    <Box 
                        component="form"
                        sx={{ 
                            display: 'flex',
                            flexDirection: 'column',
                            gap: '1rem',
                            maxWidth: '400px',
                            width: '100%',
                        }}
                        onSubmit={handleSubmit}
                    >
                        <Typography variant="body1">
                            {t('resetPassword.instructions')}
                        </Typography>

                        <FormControl fullWidth>
                            <FormLabel htmlFor="email">{t('email')}</FormLabel>
                            <TextField 
                                id="email"
                                value={email}
                                slotProps={{ 
                                    input: { readOnly: true }
                                }}
                            />
                        </FormControl>

                        <PasswordFieldWith$ 
                            id="password" 
                            label={{ value: t('password'), hasExtrenLabel: true }}
                            value={{ value: password, onChange: setPassword }} 
                            validator={{ Schema$: Password$, isValid: isPasswordValid, setIsValid: setIsPasswordValid }}
                            required
                            formControlProps={{ fullWidth: true }}
                        />

                        <PasswordFieldWith$
                            id="confirmPassword"
                            label={{ value: t('confirmPassword'), hasExtrenLabel: true }}
                            value={{ value: confirmPassword, onChange: setConfirmPassword }}
                            validator={{ Schema$: Password$, isValid: isConfirmPasswordValid, setIsValid: setIsConfirmPasswordValid }}
                            required
                            formControlProps={{ fullWidth: true }}
                        />

                        {errorMsg && (
                            <Alert severity="error">{errorMsg}</Alert>
                        )}

                        <Button 
                            variant="contained"
                            color="primary"
                            type="submit"
                            sx={{ width: '100%' }}
                            disabled={!isFormValid}
                        >
                            {t('buttons:submit')}
                        </Button>
                    </Box>
                ) : (
                    <Typography variant="body1">
                        {t('resetPassword.expiredToken')}
                    </Typography>
                )}

            </Box>
        </MaxWidth>
    )
}
