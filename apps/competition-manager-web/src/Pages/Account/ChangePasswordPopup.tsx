import { Alert, Box, Button, Dialog, DialogContent, DialogTitle, Typography } from "@mui/material"
import { useTranslation } from "react-i18next"
import { CloseButton, PasswordFieldWith$ } from "../../Components"
import { useState } from "react"
import { Password$ } from "@competition-manager/schemas"
import { changePassword } from "../../api"
import { useMutation } from "react-query"
import { isAxiosError } from "axios"

type ChangePasswordPopupProps = {
    open: boolean
    onClose: () => void
}

export const ChangePasswordPopup: React.FC<ChangePasswordPopupProps> = ({ 
    open, 
    onClose 
}) => {

    const { t } = useTranslation('account');

    const [oldPassword, setOldPassword] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [isOldPasswordValid, setIsOldPasswordValid] = useState(false);
    const [isPasswordValid, setIsPasswordValid] = useState(false);
    const [isConfirmPasswordValid, setIsConfirmPasswordValid] = useState(false);

    const [errorMsg, setErrorMsg] = useState('');

    const isFormValid = isOldPasswordValid && isPasswordValid && isConfirmPasswordValid && password !== '' && confirmPassword !== '' && oldPassword !== '';

    const mutation = useMutation((data: { oldPassword: string, newPassword: string }) => changePassword(data.oldPassword, data.newPassword), {
        onSuccess: () => {
            onClose();
        }
    });

    const handleSubmit = () => {
        // check if passwords match
        if (password !== confirmPassword) {
            setErrorMsg(t('auth:error.passwordMismatch'));
            return;
        }

        // check if form is valid
        if (!isFormValid) {
            setErrorMsg(t('auth:error.invalidForm'));
            return;
        }

        // call api
        mutation.mutate({
            oldPassword,
            newPassword: password
        });
    }

    return (
        <Dialog 
            open={open} 
            onClose={() => null}
            fullWidth
            maxWidth='xs'
        >
            <DialogTitle>
                {t('info.changePassword.title')}
                <CloseButton onClose={onClose} />
            </DialogTitle>
            <DialogContent>
                <Box 
                    component='form' 
                    sx={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}
                    onSubmit={(e) => {
                        e.preventDefault();
                        handleSubmit();
                    }}
                >
                    <Typography>{t('info.changePassword.instructions')}</Typography>

                    <PasswordFieldWith$
                        id='oldPassword'
                        label={{ value: t('info.changePassword.oldPassword'), hasExtrenLabel: true }}
                        value={{ value: oldPassword, onChange: setOldPassword }}
                        validator={{ Schema$: Password$, isValid: isOldPasswordValid, setIsValid: setIsOldPasswordValid }}
                    />

                    <PasswordFieldWith$
                        id='password'
                        label={{ value: t('info.changePassword.newPassword'), hasExtrenLabel: true }}
                        value={{ value: password, onChange: setPassword }}
                        validator={{ Schema$: Password$, isValid: isPasswordValid, setIsValid: setIsPasswordValid }}
                    />

                    <PasswordFieldWith$
                        id='confirmPassword'
                        label={{ value: t('info.changePassword.confirmNewPassword'), hasExtrenLabel: true }}
                        value={{ value: confirmPassword, onChange: setConfirmPassword }}
                        validator={{ Schema$: Password$, isValid: isConfirmPasswordValid, setIsValid: setIsConfirmPasswordValid }}
                    />

                    {mutation.isError && isAxiosError(mutation.error) && (
                        <Alert severity='error'>{mutation.error.response?.data}</Alert>
                    )}

                    {errorMsg && (
                        <Alert severity='error'>{errorMsg}</Alert>
                    )}

                    <Button
                        variant='contained'
                        color='primary'
                        type="submit"
                        disabled={!isFormValid}
                        loading={mutation.isLoading}
                    >
                        {t('buttons:submit')}
                    </Button>
                </Box>

            </DialogContent>

        </Dialog>
    )
}
