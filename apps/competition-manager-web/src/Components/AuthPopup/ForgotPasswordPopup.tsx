import { forgotPassword } from '@/api';
import { Email$ } from '@competition-manager/schemas';
import { Button, Dialog, DialogContent, DialogTitle } from '@mui/material';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useMutation } from 'react-query';
import { CloseButton } from '../CloseButton';
import { TextFieldWith$ } from '../FieldsWithSchema/TextFieldWith$';

type ForgotPasswordPopupProps = {
    onClose: () => void;
};

export const ForgotPasswordPopup: React.FC<ForgotPasswordPopupProps> = ({
    onClose,
}) => {
    const { t } = useTranslation('auth');

    const [email, setEmail] = useState('');
    const [isEmailValid, setIsEmailValid] = useState(true);

    const mutation = useMutation(forgotPassword, {
        onSuccess: () => {
            onClose();
        },
    });

    return (
        <Dialog open={true} onClose={onClose} fullWidth maxWidth="xs">
            <DialogTitle>
                {t('forgotPassword')}
                <CloseButton onClose={onClose} />
            </DialogTitle>
            <DialogContent
                sx={{
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '1rem',
                    padding: '1rem',
                }}
            >
                <TextFieldWith$
                    id="email"
                    label={{ value: t('labels:email'), hasExtrenLabel: true }}
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

                <Button
                    variant="contained"
                    color="primary"
                    sx={{ marginTop: '1rem' }}
                    disabled={!isEmailValid}
                    loading={mutation.isLoading}
                    onClick={() => mutation.mutate(email)}
                >
                    {t('buttons:submit')}
                </Button>
            </DialogContent>
        </Dialog>
    );
};
