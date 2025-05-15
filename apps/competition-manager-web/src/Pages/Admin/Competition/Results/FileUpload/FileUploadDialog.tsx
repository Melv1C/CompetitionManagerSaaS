/**
 * File: apps/competition-manager-web/src/Pages/Admin/Competition/Results/FilePopup.tsx
 *
 * Description: Dialog component for uploading and processing competition result files.
 * Handles file selection, validation, preview, and result submission.
 */
import { upsertResults } from '@/api';
import { competitionAtom } from '@/GlobalsStates';
import { UpsertResult$, UpsertResultType } from '@competition-manager/schemas';
import {
    Box,
    Button,
    CircularProgress,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    Typography,
} from '@mui/material';
import { useAtomValue } from 'jotai';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useMutation } from 'react-query';
import { EventSelectionDialog } from './EventSelectionDialog';
import { FileSelector } from './FileSelector';
import { FileTable } from './FileTable';
import { useFileProcessing } from './hooks';

/**
 * Props for the FilePopup component
 */
type FileUploadDialogProps = {
    /** Whether the dialog is open */
    open: boolean;
    /** Function to call when the dialog is closed */
    onClose: () => void;
};

/**
 * Dialog component for uploading and processing competition result files
 */
export const FileUploadDialog: React.FC<FileUploadDialogProps> = ({
    open,
    onClose,
}) => {
    const { t } = useTranslation();
    const [selectedFile, setSelectedFile] = useState<File | null>(null);

    // Get competition data from global state
    const competition = useAtomValue(competitionAtom);
    if (!competition) throw new Error('No competition data found');

    // Custom hooks for file processing and result upload functionality
    const {
        results,
        setResults,
        error,
        setError,
        isProcessing,
        processFileContent,
        needsEventSelection,
        handleEventSelection,
        cancelEventSelection,
        availableEvents,
    } = useFileProcessing(competition);

    /**
     * Mutation for handling the upload process
     */
    const uploadMutation = useMutation({
        mutationFn: async () => {
            if (!selectedFile) {
                throw new Error('No file selected');
            }
            return await upsertResults(
                competition.eid,
                UpsertResultType.FILE,
                UpsertResult$.array().parse(results)
            );
        },
        onSuccess: () => {
            // Reset form state after successful upload
            handleClearFile();
            onClose();
        },
        onError: (error: unknown) => {
            setError(
                error instanceof Error
                    ? error.message
                    : 'An unknown error occurred'
            );
        },
    });

    /**
     * Handles file selection
     */
    const handleFileSelected = (file: File, content: string) => {
        setSelectedFile(file);
        setError(null);
        setResults([]);

        try {
            processFileContent(content);
        } catch (error) {
            setError(
                error instanceof Error
                    ? error.message
                    : 'An unknown error occurred'
            );
        }
    };

    /**
     * Handles clearing the selected file
     */
    const handleClearFile = () => {
        setSelectedFile(null);
        setResults([]);
        setError(null);
        const fileInput = document.querySelector(
            'input[type="file"]'
        ) as HTMLInputElement;
        if (fileInput) fileInput.value = '';
    };

    /**
     * Initiates upload process
     */
    const handleUpload = async () => {
        if (!selectedFile) {
            setError(t('result:noFileSelected'));
            return;
        }

        uploadMutation.mutate();
    };

    // Determine if there's an error to display
    const displayError =
        error || uploadMutation.error
            ? uploadMutation.error instanceof Error
                ? uploadMutation.error.message
                : error || 'An unknown error occurred'
            : null;

    // Determine if any loading state is active
    const isLoading = isProcessing || uploadMutation.isLoading;

    return (
        <Dialog open={open} onClose={onClose} fullWidth maxWidth="lg">
            <DialogTitle>{t('result:uploadResults')}</DialogTitle>
            <DialogContent sx={{ minHeight: '60vh' }}>
                {/* Instructions section */}
                <Box sx={{ mb: 3 }}>
                    <Typography variant="body2" color="text.secondary">
                        {t('result:instructionsText')}
                    </Typography>
                </Box>

                {/* File selection section */}
                <FileSelector
                    selectedFile={selectedFile}
                    onFileSelected={handleFileSelected}
                    onClear={handleClearFile}
                    disabled={isLoading}
                    error={displayError}
                />

                {/* Loading indicator */}

                {/* Event selection dialog */}
                <EventSelectionDialog
                    open={needsEventSelection}
                    availableEvents={availableEvents}
                    onEventSelected={handleEventSelection}
                    onCancel={cancelEventSelection}
                />

                {/* Empty state when no file is selected and not loading */}
                {!selectedFile && !isLoading && !results.length && (
                    <Box
                        sx={{
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center',
                            justifyContent: 'center',
                            py: 6,
                            bgcolor: 'background.default',
                            borderRadius: 1,
                        }}
                    >
                        <Typography
                            variant="body1"
                            color="text.secondary"
                            align="center"
                        >
                            {t('result:noFileSelected')}
                        </Typography>
                    </Box>
                )}

                {/* Results preview section */}
                {results.length > 0 && <FileTable rows={results} />}
            </DialogContent>
            <DialogActions>
                <Button
                    variant="outlined"
                    onClick={onClose}
                    disabled={isLoading}
                >
                    {t('buttons:cancel')}
                </Button>
                <Button
                    variant="contained"
                    onClick={handleUpload}
                    disabled={
                        !selectedFile || isLoading || results.length === 0
                    }
                >
                    {uploadMutation.isLoading ? (
                        <CircularProgress size={24} color="inherit" />
                    ) : (
                        t('result:upload')
                    )}
                </Button>
            </DialogActions>
        </Dialog>
    );
};
