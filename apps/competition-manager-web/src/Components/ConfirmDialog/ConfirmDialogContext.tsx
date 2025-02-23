/**
 * File: apps/competition-manager-web/src/Components/ConfirmDialog/ConfirmDialogContext.tsx
 * 
 * This file implements a reusable confirmation dialog system using React Context.
 * It provides a flexible way to show confirmation dialogs that can contain both simple text
 * and complex React components.
 * 
 * Features:
 * - Support for both simple text and complex React components in dialog content
 * - Additional content section for supplementary information (e.g., warnings)
 * - Customizable confirm/cancel button text
 * - Promise-based API for handling user responses
 * - Fully typed with TypeScript
 */

import React, { createContext, useState, useCallback, ReactNode } from 'react';
import { Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, Box } from '@mui/material';
import { useTranslation } from 'react-i18next';

/**
 * Type definition for the context value.
 * Provides a confirm method that returns a Promise resolving to the user's choice.
 */
interface ConfirmDialogContextType {
    confirm: (options: ConfirmDialogOptions) => Promise<boolean>;
}

/**
 * Configuration options for the confirmation dialog.
 * 
 * @property title - The dialog title (always a string for consistent styling)
 * @property message - The main dialog message (can be text or a React component)
 * @property additionalContent - Optional secondary content (e.g., warnings or additional info)
 * @property confirmText - Optional custom text for the confirm button
 * @property cancelText - Optional custom text for the cancel button
 */
interface ConfirmDialogOptions {
    title: string;
    message: ReactNode;
    additionalContent?: ReactNode;
    confirmText?: string;
    cancelText?: string;
}

// Create the context with undefined as initial value
export const ConfirmDialogContext = createContext<ConfirmDialogContextType | undefined>(undefined);

/**
 * Provider component that manages the confirmation dialog state and rendering.
 * 
 * Usage:
 * ```tsx
 * <ConfirmDialogProvider>
 *   <App />
 * </ConfirmDialogProvider>
 * ```
 */
export const ConfirmDialogProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const { t } = useTranslation();
    
    // State to track the current dialog configuration and resolve function
    const [dialog, setDialog] = useState<{
        isOpen: boolean;
        options: ConfirmDialogOptions;
        resolve: (value: boolean) => void;
    } | null>(null);

    /**
     * Shows a confirmation dialog and returns a Promise that resolves when the user makes a choice.
     * 
     * @param options - Configuration options for the dialog
     * @returns Promise<boolean> - Resolves to true if confirmed, false if cancelled
     */
    const confirm = useCallback((options: ConfirmDialogOptions): Promise<boolean> => {
        return new Promise((resolve) => {
            setDialog({
                isOpen: true,
                options,
                resolve,
            });
        });
    }, []);

    /**
     * Handles dialog closure, resolving the Promise with the user's choice.
     * 
     * @param confirmed - Whether the user confirmed or cancelled
     */
    const handleClose = useCallback((confirmed: boolean) => {
        if (dialog) {
            dialog.resolve(confirmed);
            setDialog(null);
        }
    }, [dialog]);

    return (
        <ConfirmDialogContext.Provider value={{ confirm }}>
            {children}
            {dialog && (
                <Dialog
                    open={dialog.isOpen}
                    onClose={() => handleClose(false)}
                    aria-labelledby="confirm-dialog-title"
                    aria-describedby="confirm-dialog-description"
                >
                    <DialogTitle id="confirm-dialog-title">
                        {dialog.options.title}
                    </DialogTitle>
                    <DialogContent>
                        {/* Render message as DialogContentText if it's a string, otherwise render as is */}
                        {typeof dialog.options.message === 'string' ? (
                            <DialogContentText id="confirm-dialog-description">
                                {dialog.options.message}
                            </DialogContentText>
                        ) : (
                            dialog.options.message
                        )}
                        {/* Render additional content if provided */}
                        {dialog.options.additionalContent && (
                            <Box sx={{ mt: 2 }}>
                                {dialog.options.additionalContent}
                            </Box>
                        )}
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={() => handleClose(false)} color="primary">
                            {dialog.options.cancelText || t('common:cancel')}
                        </Button>
                        <Button onClick={() => handleClose(true)} color="primary" variant="contained">
                            {dialog.options.confirmText || t('common:confirm')}
                        </Button>
                    </DialogActions>
                </Dialog>
            )}
        </ConfirmDialogContext.Provider>
    );
}; 