import { faClose } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { IconButton, useTheme } from "@mui/material";


type CloseButtonProps = {
    onClose: () => void;
};

export const CloseButton: React.FC<CloseButtonProps> = ({ onClose }) => {
    const theme = useTheme();

    return (
        <IconButton 
            onClick={onClose} 
            sx={{ 
                position: 'absolute', 
                top: '0', 
                right: '0',
            }}
        >
            <FontAwesomeIcon icon={faClose} style={{ width: '2rem', height: '2rem', color: theme.palette.text.primary }} />
        </IconButton>
    );
}
