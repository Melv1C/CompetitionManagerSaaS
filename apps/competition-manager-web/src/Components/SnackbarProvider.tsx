
import React, { createContext, useState } from "react";
import { Snackbar, Alert, AlertProps } from "@mui/material";

export type SnackbarContextType = {
    showSnackbar: (message: string, severity?: AlertProps["severity"]) => void;
};

export const SnackbarContext = createContext<SnackbarContextType | undefined>(undefined);

export const SnackbarProvider = ({ children }: { children: React.ReactNode }) => {
    const [open, setOpen] = useState(false);
    const [message, setMessage] = useState("");
    const [severity, setSeverity] = useState<"success" | "error" | "warning" | "info">("info");

    const showSnackbar = (msg: string, sev: "success" | "error" | "warning" | "info" = "info") => {
        setMessage(msg);
        setSeverity(sev);
        setOpen(true);
    };

    return (
        <SnackbarContext.Provider value={{ showSnackbar }}>
            {children}
            <Snackbar 
                open={open} 
                autoHideDuration={6000} 
                onClose={() => setOpen(false)}
                anchorOrigin={{ vertical: "top", horizontal: "right" }}
            >
                <Alert onClose={() => setOpen(false)} severity={severity} sx={{ width: "100%" }}>
                {message}
                </Alert>
            </Snackbar>
        </SnackbarContext.Provider>
    );
};