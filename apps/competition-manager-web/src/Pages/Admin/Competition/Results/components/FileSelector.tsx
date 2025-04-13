/**
 * File: apps/competition-manager-web/src/Pages/Admin/Competition/Results/components/FileSelector.tsx
 *
 * Description: Component for selecting and displaying XML files for result import.
 * Handles file input, validation, and previewing selected files.
 */
import { faFileImport, faTimes } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Alert, Box, Button, Chip, Typography } from '@mui/material';
import { ChangeEvent, useRef } from 'react';
import { useTranslation } from 'react-i18next';

interface FileSelectorProps {
    /**
     * Currently selected file
     */
    selectedFile: File | null;
    /**
     * Callback for when a file is selected
     */
    onFileSelected: (file: File, content: string) => void;
    /**
     * Callback for when the file is cleared
     */
    onClear: () => void;
    /**
     * Whether the component is disabled
     */
    disabled?: boolean;
    /**
     * Error message to display
     */
    error: string | null;
}

/**
 * Component for selecting and displaying the selected XML file
 * Includes validation for XML files and provides user feedback
 */
export const FileSelector: React.FC<FileSelectorProps> = ({
    selectedFile,
    onFileSelected,
    onClear,
    disabled = false,
    error,
}) => {
    const { t } = useTranslation();
    const fileInputRef = useRef<HTMLInputElement>(null);

    /**
     * Validates that the file is an XML file
     *
     * @param file - The file to validate
     * @returns Whether the file is valid
     */
    const validateFile = (file: File): boolean => {
        // Check file type
        if (!file.name.toLowerCase().endsWith('.xml')) {
            throw new Error(t('result:invalidFileType'));
        }

        return true;
    };

    /**
     * Handles file selection change
     */
    const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
        if (event.target.files && event.target.files.length > 0) {
            const file = event.target.files[0];

            try {
                validateFile(file);

                const reader = new FileReader();

                reader.onload = (e) => {
                    if (!e.target?.result) {
                        throw new Error(t('result:failedToReadFile'));
                    }

                    const fileContent = e.target.result as string;

                    // Basic XML validation
                    if (!fileContent.trim().startsWith('<?xml')) {
                        throw new Error(t('result:invalidXmlFormat'));
                    }

                    onFileSelected(file, fileContent);
                };

                reader.onerror = () => {
                    throw new Error(t('result:errorReadingFile'));
                };

                reader.readAsText(file);
            } catch (error) {
                console.error('File validation error:', error);
                onClear(); // Clear any previously selected file
                if (error instanceof Error) {
                    // Pass the error to parent component
                    onFileSelected(file, '');
                    // Reset the file input
                    if (fileInputRef.current) {
                        fileInputRef.current.value = '';
                    }
                }
            }
        }
    };

    return (
        <Box
            sx={{
                display: 'flex',
                flexDirection: 'column',
                gap: 2,
                mb: 2,
            }}
        >
            {/* File selection button */}
            <Box
                sx={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 2,
                }}
            >
                {!selectedFile && (
                    <Button
                        component="label"
                        role={undefined}
                        variant="contained"
                        tabIndex={-1}
                        startIcon={<FontAwesomeIcon icon={faFileImport} />}
                        disabled={disabled}
                    >
                        {t('result:selectFile')}
                        <input
                            ref={fileInputRef}
                            type="file"
                            hidden
                            onChange={handleFileChange}
                            accept=".xml"
                            disabled={disabled}
                        />
                    </Button>
                )}

                {/* Display selected file info */}
                {selectedFile && (
                    <Box
                        sx={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: 1,
                            flexWrap: 'wrap',
                        }}
                    >
                        <Chip
                            label={selectedFile.name}
                            color="primary"
                            variant="outlined"
                            onDelete={disabled ? undefined : onClear}
                            deleteIcon={<FontAwesomeIcon icon={faTimes} />}
                            sx={{
                                padding: 1,
                            }}
                        />
                        <Typography variant="caption" color="text.secondary">
                            {(selectedFile.size / 1024).toFixed(1)} KB
                        </Typography>
                    </Box>
                )}
            </Box>

            {/* Error message display */}
            {error && <Alert severity="error">{error}</Alert>}
        </Box>
    );
};
