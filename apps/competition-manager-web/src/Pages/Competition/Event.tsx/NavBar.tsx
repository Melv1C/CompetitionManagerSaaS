import { CompetitionEvent } from "@competition-manager/schemas"
import { Tab, Tabs } from "@mui/material";
import { useNavigate } from "react-router-dom";

type NavBarProps = {
    baseUrl: string;
    events: CompetitionEvent[];
    currentEvent: CompetitionEvent;
}

export const NavBar: React.FC<NavBarProps> = ({ 
    baseUrl,
    events, 
    currentEvent 
}) => {

    const navigate = useNavigate();

    return (
        <Tabs
            value={currentEvent.eid}
            centered
            variant="scrollable"
            sx={{
                padding: '0 1rem',
            }}
        >
            {events.map(event => (
                <Tab 
                    key={event.eid}
                    label={event.event.abbr}
                    value={event.eid}
                    onClick={() => navigate(`${baseUrl}/${event.eid}`)}
                    sx={{
                        textTransform: 'none',
                        minWidth: 50,
                    }}
                />
            ))}
        </Tabs>
    )

}
