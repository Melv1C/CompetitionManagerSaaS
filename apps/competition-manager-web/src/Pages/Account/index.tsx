import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

import { Box, Button, Typography } from "@mui/material"

import { useUserToken } from "../../GlobalsStates/userToken";
import { logout } from "../../utils/auth";


export const Account = () => {

    const [userToken, setUserToken] = useUserToken();
    
    const navigate = useNavigate();

    useEffect(() => {
        if (!userToken) {
            navigate('/');
        }
    }, [userToken, navigate]);

    return (
        <Box>
            <Typography variant="h4" sx={{ textAlign: 'center' }}>Account</Typography>
            <Button 
                variant="contained" 
                color="primary"
                onClick={() => {
                    setUserToken('NOT_LOGGED');
                    logout();
                }}
            >
                Sign Out
            </Button>
        </Box>
    )
}
