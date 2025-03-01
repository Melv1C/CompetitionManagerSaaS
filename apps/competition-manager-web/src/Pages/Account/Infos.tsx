import { logout, resendVerificationEmail } from '@/api';
import { userTokenAtom } from '@/GlobalsStates';
import { useRoles, useSnackbar } from '@/hooks';
import {
    Alert,
    AlertTitle,
    Button,
    Card,
    CardActions,
    CardContent,
    CardHeader,
    FormControl,
    FormLabel,
    TextField,
} from '@mui/material';
import { isAxiosError } from 'axios';
import { useAtom } from 'jotai';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useMutation } from 'react-query';
import { ChangePasswordPopup } from './ChangePasswordPopup';

export const Infos = () => {
    const { t } = useTranslation('account');
    const { showSnackbar } = useSnackbar();
    const [userToken, setUserToken] = useAtom(userTokenAtom);
    if (!userToken) throw new Error('No user token found');
    if (userToken === 'NOT_LOGGED') throw new Error('User not logged');

    const { isUser, isAdmin, isSuperAdmin } = useRoles();

    const handleLogout = () => {
        setUserToken('NOT_LOGGED');
        logout();
    };

    const [isChangePasswordPopupVisible, setIsChangePasswordPopupVisible] =
        useState(false);

    const mutation = useMutation(resendVerificationEmail, {
        onSuccess: () =>
            showSnackbar(t('auth:sentVerificationEmail'), 'success'),
        onError: (error) => {
            if (isAxiosError(error)) {
                showSnackbar(error.response?.data, 'error');
            } else {
                showSnackbar(t('glossary:unexpectedError'), 'error');
            }
        },
    });

    return (
        <Card sx={{ width: 500 }}>
            <CardHeader title={t('info.title')} />
            <CardContent
                sx={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}
            >
                <FormControl fullWidth>
                    <FormLabel>{t('labels:email')}</FormLabel>
                    <TextField
                        value={userToken.email}
                        slotProps={{ input: { readOnly: true } }}
                    />
                </FormControl>
                {!isUser && (
                    <Alert severity="warning">
                        <AlertTitle>
                            {t('info.unconfirmedEmail.title')}
                        </AlertTitle>
                        {t('info.unconfirmedEmail.message')}
                        {mutation.isIdle && (
                            <>
                                {' '}
                                <Button
                                    color="primary"
                                    onClick={() => mutation.mutate()}
                                    loading={mutation.isLoading}
                                >
                                    {t('info.unconfirmedEmail.resend')}
                                </Button>
                            </>
                        )}
                    </Alert>
                )}
                {isAdmin && (
                    <Alert severity="info">
                        {isSuperAdmin
                            ? t('info.isSuperAdmin')
                            : t('info.isAdmin')}
                    </Alert>
                )}
            </CardContent>
            <CardActions sx={{ justifyContent: 'flex-end', padding: '1rem' }}>
                <Button
                    color="primary"
                    variant="outlined"
                    onClick={() => setIsChangePasswordPopupVisible(true)}
                >
                    {t('info.changePassword.title')}
                </Button>
                <Button
                    onClick={handleLogout}
                    color="error"
                    variant="contained"
                >
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
    );
};
