import { Alert, AlertTitle, Button, Card, CardActions, CardContent, CardHeader, FormControl, FormLabel, TextField } from "@mui/material";
import { useAtom } from "jotai";
import { useTranslation } from "react-i18next"
import { logout, resendVerificationEmail } from "../../api";
import { userTokenAtom } from "../../GlobalsStates";
import { isAuthorized } from "@competition-manager/utils";
import { Role } from "@competition-manager/schemas";
import { useState } from "react";
import { ChangePasswordPopup } from "./ChangePasswordPopup";

export const Infos = () => {

    const { t } = useTranslation('account');
    const [userToken, setUserToken] = useAtom(userTokenAtom);
    if (!userToken) throw new Error('No user token found');
    if (userToken === 'NOT_LOGGED') throw new Error('User not logged');

    const handleLogout = () => {
        setUserToken('NOT_LOGGED');
        logout();
    }

    const [isChangePasswordPopupVisible, setIsChangePasswordPopupVisible] = useState(false);

    return (
        <Card sx={{ width: 500 }}>
            <CardHeader title={t('info.title')} />
            <CardContent sx={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                <FormControl fullWidth>
                    <FormLabel>{t('labels:email')}</FormLabel>
                    <TextField value={userToken.email} slotProps={{ input: { readOnly: true } }} />
                </FormControl>
                {userToken.role === Role.UNCONFIRMED_USER && (
                    <Alert severity='warning'>
                        <AlertTitle>{t('info.unconfirmedEmail.title')}</AlertTitle>
                        {t('info.unconfirmedEmail.message')}
                        {' '}
                        <Button color='primary' onClick={() => resendVerificationEmail()}>
                            {t('info.unconfirmedEmail.resend')}
                        </Button>
                    </Alert>
                )}
                {isAuthorized(userToken, Role.ADMIN) && (
                    <Alert severity='info'>
                        {userToken.role === Role.ADMIN ? t('info.isAdmin') : t('info.isSuperAdmin')}
                    </Alert> 
                )}
            </CardContent>
            <CardActions sx={{ justifyContent: 'flex-end', padding: '1rem' }}>
                <Button color='primary' variant='outlined' onClick={() => setIsChangePasswordPopupVisible(true)}>
                    {t('info.changePassword.title')}
                </Button>
                <Button onClick={handleLogout} color='error' variant='contained'>
                    {t('auth:logout')}
                </Button>
            </CardActions>
            {isChangePasswordPopupVisible && (
                <ChangePasswordPopup 
                    open={isChangePasswordPopupVisible}
                    onClose={() => setIsChangePasswordPopupVisible(false)}
                />
            )}
        </Card>
    )
}
