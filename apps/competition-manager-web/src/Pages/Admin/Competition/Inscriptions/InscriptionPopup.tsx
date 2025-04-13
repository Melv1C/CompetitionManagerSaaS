import { CloseButton, InscriptionWizard, MaxWidth } from '@/Components';
import { Dialog, DialogContent, DialogTitle } from '@mui/material';

type InscriptionPopupProps = {
    isVisible: boolean;
    onClose: () => void;
};

export const InscriptionPopup: React.FC<InscriptionPopupProps> = ({
    isVisible,
    onClose,
}) => {
    return (
        <Dialog
            open={isVisible}
            onClose={onClose}
            maxWidth="md"
            fullWidth
            fullScreen
        >
            <MaxWidth>
                <DialogTitle>
                    <CloseButton onClose={onClose} />
                </DialogTitle>
                <DialogContent>
                    <InscriptionWizard isAdmin={true} />
                </DialogContent>
            </MaxWidth>
        </Dialog>
    );
};
