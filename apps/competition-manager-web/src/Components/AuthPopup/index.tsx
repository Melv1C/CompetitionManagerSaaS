import { useState } from "react";

import { Box, Modal } from "@mui/material";

import { SignIn } from "./SignIn";
import { SignUp } from "./SignUp";
import { CloseButton } from "..";

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
                    borderRadius: '8px'  
                }}
            >
                <Box sx={{ p: 4 }}>
                    <CloseButton onClose={onClose} />
                    {isSignIn ? <SignIn onToggle={handleToggle} /> : <SignUp onToggle={handleToggle} />}
                </Box>
            </Box>
        </Modal>
    );
};
