import { useState } from "react";

import { Box, IconButton, Modal } from "@mui/material";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faClose } from "@fortawesome/free-solid-svg-icons";

import { SignIn } from "./SignIn";
import { SignUp } from "./SignUp";

type AuthPopupProps = {
    isVisible: boolean;
    onClose: () => void;
};

export const AuthPopup = ({ isVisible, onClose }: AuthPopupProps) => {

    const [isSignIn, setIsSignIn] = useState(true);

    const handleToggle = () => {
        setIsSignIn((prev) => !prev);
    }

    return (
        <Modal 
            open={isVisible} 
        >
            <Box 
                sx={{ 
                    position: 'absolute', 
                    top: '50%', 
                    left: '50%', 
                    transform: 'translate(-50%, -50%)',
                    width: '80%', 
                    maxWidth: '400px', 
                    bgcolor: 'background.paper', 
                    boxShadow: 24, 
                    p: 4, 
                    borderRadius: '8px'  
                }}
            >
                <CloseButton onClose={onClose} />
                {isSignIn ? <SignIn onToggle={handleToggle} /> : <SignUp onToggle={handleToggle} />}
            </Box>
        </Modal>
    );
};

type CloseButtonProps = {
    onClose: () => void;
};

const CloseButton = ({ onClose }: CloseButtonProps) => {
    return (
        <IconButton 
            onClick={onClose} 
            sx={{ 
                position: 'absolute', 
                top: '0', 
                right: '0',
            }}
        >
            <FontAwesomeIcon icon={faClose} style={{ width: '2rem', height: '2rem' }} />
        </IconButton>
    );
};
