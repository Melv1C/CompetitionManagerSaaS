
import { useTranslation } from "react-i18next"
import { MaxWidth, PasswordFieldWith$ } from "../Components"
import { useNavigate, useSearchParams } from "react-router-dom"
import { jwtDecode } from "jwt-decode"
import { Alert, Box, Button, FormControl, FormLabel, TextField, Typography } from "@mui/material"
import { useState } from "react"
import { TokenData$, Password$ } from "@competition-manager/schemas"
import { resetPassword } from "../api"
import { useMutation } from "react-query"
import { isAxiosError } from "axios"


export const ResetPassword = () => {

    const { t } = useTranslation('auth')
    const [searchParams] = useSearchParams()
    const navigate = useNavigate()

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

    const mutation = useMutation((data: { email: string, password: string }) => resetPassword(data.email, data.password), {
        onSuccess: () => {
            navigate('/')
        }
    })

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault()
        
        // check if form is valid
        if (!isFormValid) {
            setErrorMsg(t('error.invalidForm'))
            return
        }
       
        // compare password and confirmPassword
        if (password !== confirmPassword) {
            setErrorMsg(t('error.passwordMismatch'))
            return
        }


        // call api
        mutation.mutate({
            email,
            password
        })
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
                        
                        <Button 
                            variant="contained"
                            color="primary"
                            type="submit"
                            sx={{ width: '100%' }}
                            disabled={!isFormValid}
                            loading={mutation.isLoading}
                        >
                            {t('buttons:submit')}
                        </Button>
                        
                        {mutation.isError && isAxiosError(mutation.error) && (
                            <Alert severity="error">{t('errors:' + mutation.error.response?.data)}</Alert>
                        )}

                        {errorMsg && (
                            <Alert severity="error">{errorMsg}</Alert>
                        )}
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
