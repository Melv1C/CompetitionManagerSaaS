import { Id, Inscription } from "@competition-manager/schemas";
import { useState } from "react";
import { Box, Button, Checkbox, CircularProgress, List, ListItem, ListItemIcon, ListItemText, Paper, Typography } from "@mui/material";

type ParticipantsSelectorProps = {
    inscriptions: Inscription[];
    onSubmit: (inscriptions: Inscription[]) => void;
    isSubmitting: boolean;
};

export const ParticipantsSelector: React.FC<ParticipantsSelectorProps> = ({ inscriptions, onSubmit, isSubmitting }) => {
    const [selectedParticipants, setSelectedParticipants] = useState(
        inscriptions.map(inscription => inscription.id)
    );

    const handleToggleParticipant = (inscriptionId: Id) => {
        setSelectedParticipants(prev => {
            if (prev.includes(inscriptionId)) {
                return prev.filter(id => id !== inscriptionId);
            } else {
                return [...prev, inscriptionId];
            }
        });
    };

    const handleSelectAll = () => {
        setSelectedParticipants(inscriptions.map(inscription => inscription.id));
    };

    const handleSelectNone = () => {
        setSelectedParticipants([]);
    };

    const handleSubmit = () => {
        const selectedInscriptions = inscriptions.filter(inscription => 
            selectedParticipants.includes(inscription.id)
        );
        onSubmit(selectedInscriptions);
    };

    return (
        <Paper sx={{ p: 3, maxWidth: 600, mx: "auto", mt: 2 }}>
            <Typography variant="h6" gutterBottom>
                Select Participants for the Event
            </Typography>
            
            <Box sx={{ display: "flex", justifyContent: "space-between", mb: 2 }}>
                <Button variant="outlined" onClick={handleSelectAll}>
                    Select All
                </Button>
                <Button variant="outlined" onClick={handleSelectNone}>
                    Clear Selection
                </Button>
            </Box>
            
            <List sx={{ maxHeight: 400, overflow: "auto" }}>
                {inscriptions.map((inscription) => (
                    <ListItem key={inscription.id} dense button onClick={() => handleToggleParticipant(inscription.id)}>
                        <ListItemIcon>
                            <Checkbox
                                edge="start"
                                checked={selectedParticipants.includes(inscription.id)}
                                tabIndex={-1}
                                disableRipple
                            />
                        </ListItemIcon>
                        <ListItemText 
                            primary={`${inscription.athlete.firstName} ${inscription.athlete.lastName}`} 
                            secondary={`Bib: ${inscription.bib}`} 
                        />
                    </ListItem>
                ))}
            </List>
            
            <Box sx={{ mt: 2, textAlign: "right" }}>
                <Button 
                    variant="contained" 
                    color="primary" 
                    onClick={handleSubmit}
                    disabled={selectedParticipants.length === 0 || isSubmitting}
                >
                    {isSubmitting ? (
                        <>
                            <CircularProgress size={24} color="inherit" sx={{ mr: 1 }} />
                            Creating...
                        </>
                    ) : (
                        "Confirm Participants"
                    )}
                </Button>
            </Box>
        </Paper>
    );
};