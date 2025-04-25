import { faArrowUpFromBracket } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { IconButton, Tooltip } from '@mui/material';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { FileUploadDialog } from './FileUploadDialog';

export const FileUpload = () => {
    const { t } = useTranslation();

    // State for managing file upload popup visibility
    const [filePopupVisible, setFilePopupVisible] = useState(false);

    return (
        <>
            {/* Upload button with tooltip */}
            <Tooltip title={t('result:uploadResults')}>
                <IconButton
                    onClick={() => setFilePopupVisible(true)}
                    color="primary"
                    size="large"
                >
                    <FontAwesomeIcon icon={faArrowUpFromBracket} />
                </IconButton>
            </Tooltip>
            {/* File upload popup */}
            {filePopupVisible && (
                <FileUploadDialog
                    open={filePopupVisible}
                    onClose={() => setFilePopupVisible(false)}
                />
            )}
        </>
    );
};
