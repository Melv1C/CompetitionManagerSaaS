import { ConfirmDialogContext } from '@/contexts';
import { useContext } from 'react';

export const useConfirmDialog = () => {
    const context = useContext(ConfirmDialogContext);
    if (!context) {
        throw new Error(
            'useConfirmDialog must be used within a ConfirmDialogProvider'
        );
    }
    return context;
};
