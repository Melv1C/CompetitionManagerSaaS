/**
 * File: apps/competition-manager-web/src/Pages/Admin/Competition/Results/components/FileSelector.tsx
 *
 * Description: Component for selecting and displaying XML files for result import.
 * Handles file input, validation, and previewing selected files.
 */
import { faFileCode, faTimes } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Alert, Box, Chip, Paper, Typography } from '@mui/material';
import { ChangeEvent, DragEvent, useRef, useState } from 'react';
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
    const [isDragging, setIsDragging] = useState(false);

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
     * Process the selected file
     */
    const processFile = (file: File) => {
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
    };

    /**
     * Handles file selection change
     */
    const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
        if (event.target.files && event.target.files.length > 0) {
            const file = event.target.files[0];
            processFile(file);
        }
    };

    /**
     * Drag and drop handlers
     */
    const handleDragOver = (e: DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        e.stopPropagation();
        if (!disabled) {
            setIsDragging(true);
        }
    };

    const handleDragLeave = (e: DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        e.stopPropagation();
        setIsDragging(false);
    };

    const handleDrop = (e: DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        e.stopPropagation();
        setIsDragging(false);

        if (disabled) return;

        if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
            const file = e.dataTransfer.files[0];
            processFile(file);
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
            {/* Drop zone or selected file display */}
            {!selectedFile ? (
                <Paper
                    onDragOver={handleDragOver}
                    onDragLeave={handleDragLeave}
                    onDrop={handleDrop}
                    onClick={() => !disabled && fileInputRef.current?.click()}
                    sx={{
                        border: isDragging
                            ? '2px dashed #4caf50'
                            : '2px dashed #cccccc',
                        borderRadius: 2,
                        p: 4,
                        backgroundColor: isDragging
                            ? 'rgba(76, 175, 80, 0.08)'
                            : 'transparent',
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        justifyContent: 'center',
                        cursor: disabled ? 'not-allowed' : 'pointer',
                        opacity: disabled ? 0.7 : 1,
                        transition: 'all 0.2s ease-in-out',
                        height: '180px',
                    }}
                >
                    <FontAwesomeIcon
                        icon={faFileCode}
                        size="3x"
                        color={isDragging ? '#4caf50' : '#999999'}
                        style={{ marginBottom: '16px' }}
                    />
                    <Typography
                        variant="h6"
                        color={isDragging ? 'primary' : 'text.secondary'}
                    >
                        {t('result:dropXmlFile', 'Drop XML file here')}
                    </Typography>
                    <Typography
                        variant="body2"
                        color="text.secondary"
                        sx={{ mt: 1 }}
                    >
                        {t(
                            'result:orClickToSelect',
                            'or click to select a file'
                        )}
                    </Typography>
                    <input
                        ref={fileInputRef}
                        type="file"
                        hidden
                        onChange={handleFileChange}
                        accept=".xml"
                        disabled={disabled}
                    />
                </Paper>
            ) : (
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

            {/* Error message display */}
            {error && <Alert severity="error">{error}</Alert>}
        </Box>
    );
};
