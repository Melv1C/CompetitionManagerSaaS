import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

import { Box, Button, Typography } from "@mui/material"

import { logout } from "../../api";
import { useAtom } from "jotai";
import { userTokenAtom } from "../../GlobalsStates";


export const Account = () => {

    const [userToken, setUserToken] = useAtom(userTokenAtom);
    
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
