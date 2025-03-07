/**
 * File: apps/competition-manager-web/src/Pages/Admin/Competition/Results/FilePopup.tsx
 *
 * Description: Dialog component for uploading and processing competition result files.
 * Handles file selection, validation, preview, and result submission.
 */
import { competitionAtom } from '@/GlobalsStates';
import { faFileImport } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
    Alert,
    Box,
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    MenuItem,
    Select,
    SelectChangeEvent,
} from '@mui/material';
import { useAtomValue } from 'jotai';
import { ChangeEvent, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useMutation } from 'react-query';
import { FileTable } from './FileTable';
import { useFileProcessing, useResultsUpload } from './hooks';

/**
 * Props for the FilePopup component
 */
type PopupProps = {
    /** Whether the dialog is open */
    open: boolean;
    /** Function to call when the dialog is closed */
    onClose: () => void;
};

/**
 * Dialog component for uploading and processing competition result files
 *
 * @param props - Component properties
 * @returns React component for file upload dialog
 */
export const FilePopup: React.FC<PopupProps> = ({ open, onClose }) => {
    const { t } = useTranslation();
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const [eventEid, setEventEid] = useState<string>('autoDetect');

    // Get competition data from global state
    const competition = useAtomValue(competitionAtom);
    if (!competition) throw new Error('No competition data found');

    // Custom hooks for file processing and result upload functionality
    const { results, setResults, error, setError, processFileContent } =
        useFileProcessing(eventEid, competition);

    const { uploadResults } = useResultsUpload();

    /**
     * Mutation for handling the upload process
     */
    const uploadMutation = useMutation({
        mutationFn: async () => {
            if (!selectedFile) {
                throw new Error('No file selected');
            }
            return await uploadResults(results);
        },
        onSuccess: () => {
            // Reset form state after successful upload
            setSelectedFile(null);
            const fileInput = document.querySelector(
                'input[type="file"]'
            ) as HTMLInputElement;
            if (fileInput) fileInput.value = '';
            setResults([]);
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
     * Handles dialog cancellation
     */
    const handleCancel = () => {
        onClose();
    };

    /**
     * Handles file selection change
     *
     * @param event - File input change event
     */
    const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
        if (event.target.files && event.target.files.length > 0) {
            setSelectedFile(event.target.files[0]);
            setError(null);
            setResults([]);

            try {
                const reader = new FileReader();

                reader.onload = async (e) => {
                    if (!e.target?.result)
                        throw new Error('Failed to read file');

                    const fileContent = e.target.result as string;
                    await processFileContent(fileContent);
                };

                reader.onerror = () => {
                    setError('Error reading file');
                };
                reader.readAsText(event.target.files[0]);
            } catch (error) {
                setError(
                    error instanceof Error
                        ? error.message
                        : 'An unknown error occurred'
                );
            }
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
     * Handles event selection change
     *
     * @param event - Select change event
     */
    const handleEventChange = (event: SelectChangeEvent) => {
        setEventEid(event.target.value);
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

    // Find the selected event type for formatting results correctly
    const selectedEventType =
        eventEid !== 'autoDetect'
            ? competition.events.find((event) => event.eid === eventEid)?.event
                  .type
            : undefined;

    return (
        <Dialog open={open} onClose={onClose} fullWidth maxWidth="lg">
            <DialogContent sx={{ minHeight: '60vh' }}>
                <Box
                    sx={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: 2,
                    }}
                >
                    {/* File selection button */}
                    <Button
                        component="label"
                        role={undefined}
                        variant="contained"
                        tabIndex={-1}
                        startIcon={<FontAwesomeIcon icon={faFileImport} />}
                        disabled={uploadMutation.isLoading}
                    >
                        {t('result:selectFile')}
                        <input
                            type="file"
                            hidden
                            onChange={handleFileChange}
                            accept=".xml"
                            disabled={uploadMutation.isLoading}
                        />
                    </Button>

                    {/* Display selected file info */}
                    {selectedFile && (
                        <Alert
                            severity="info"
                            action={
                                <Button
                                    color="inherit"
                                    size="small"
                                    onClick={handleClearFile}
                                    disabled={uploadMutation.isLoading}
                                >
                                    {t('buttons:clear')}
                                </Button>
                            }
                        >
                            {t('result:selectedFile', {
                                name: selectedFile.name,
                            })}
                        </Alert>
                    )}

                    {/* Event selection dropdown */}
                    <Select
                        value={eventEid}
                        onChange={handleEventChange}
                        sx={{
                            width: '300px',
                            marginLeft: 'auto',
                        }}
                    >
                        <MenuItem key={'autoDetect'} value={'autoDetect'}>
                            {t('result:autoDetect')}
                        </MenuItem>
                        {competition.events.map((event) => (
                            <MenuItem key={event.eid} value={event.eid}>
                                {event.name}
                            </MenuItem>
                        ))}
                    </Select>
                </Box>

                {/* Error message display */}
                {displayError && (
                    <Alert severity="error" sx={{ mt: 2 }}>
                        {displayError}
                    </Alert>
                )}

                {/* Results preview table */}
                <FileTable rows={results} eventType={selectedEventType} />
            </DialogContent>
            <DialogActions>
                <Button variant="outlined" onClick={handleCancel}>
                    {t('buttons:cancel')}
                </Button>
                <Button
                    variant="contained"
                    onClick={handleUpload}
                    disabled={!selectedFile || uploadMutation.isLoading}
                >
                    {t('result:upload')}
                </Button>
            </DialogActions>
        </Dialog>
    );
};
