import { Button, Dialog, DialogActions, DialogTitle } from '@mui/material';
import { useTranslation } from 'react-i18next';

type OnLeavePopupProps = {
    onStay: () => void;
    onLeave: () => void;
};

export const OnLeavePopup = ({ onStay, onLeave }: OnLeavePopupProps) => {
    const { t } = useTranslation();

    return (
        <Dialog open fullWidth maxWidth="xs">
            <DialogTitle>{t('adminCompetition:onLeavePopup')}</DialogTitle>
            <DialogActions>
                <Button onClick={onStay} color="primary">
                    {t('buttons:stay')}
                </Button>
                <Button onClick={onLeave} color="primary">
                    {t('buttons:leave')}
                </Button>
            </DialogActions>
        </Dialog>
    );
};
