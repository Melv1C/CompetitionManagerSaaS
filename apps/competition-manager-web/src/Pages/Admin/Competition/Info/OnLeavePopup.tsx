import { Button, Dialog, DialogActions, DialogTitle } from "@mui/material";


type OnLeavePopupProps = {
    onStay: () => void;
    onLeave: () => void;
}

export const OnLeavePopup = ({ onStay, onLeave }: OnLeavePopupProps) => {
    return (
        <Dialog
            open
            fullWidth
            maxWidth="xs"
        >
            <DialogTitle>Are you sure you want to leave?</DialogTitle>
            <DialogActions>
                <Button onClick={onStay} color="primary">
                    Stay
                </Button>
                <Button onClick={onLeave} color="primary">
                    Leave
                </Button>
            </DialogActions>
        </Dialog>
    )
}
