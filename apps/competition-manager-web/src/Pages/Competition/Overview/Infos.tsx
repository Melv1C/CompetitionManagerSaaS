import { useAtomValue } from "jotai";
import { competitionAtom } from "../../../GlobalsStates";
import {Avatar, Card, Link, List, ListItem, ListItemAvatar, ListItemText } from "@mui/material";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCalendar, faEnvelope, faLocationDot, faPhone } from "@fortawesome/free-solid-svg-icons";


export const Infos = () => {
        
    const competition = useAtomValue(competitionAtom);
    if (!competition) throw new Error('No competition found');

    return (
        <Card 
            sx={{ 
                minWidth: 250,
                height: 'fit-content'
            }}
        >
            <List>
                {/* Date */}
                <ListItem>
                    <ListItemAvatar>
                        <Avatar sx={{ backgroundColor: 'primary.main', width: 36, height: 36 }}>
                            <FontAwesomeIcon icon={faCalendar} size="sm" color="white" />
                        </Avatar>
                    </ListItemAvatar>
                    <ListItemText
                        primary={competition.closeDate ? `${competition.date.toLocaleDateString('fr')} - ${competition.closeDate.toLocaleDateString('fr')}` : competition.date.toLocaleDateString('fr')}
                    />
                </ListItem>

                {/* Location */}
                {(competition.location || competition.club) && (
                    <ListItem>
                        <ListItemAvatar>
                            <Avatar sx={{ backgroundColor: 'primary.main', width: 36, height: 36 }}>
                                <FontAwesomeIcon icon={faLocationDot} size="sm" color="white" />
                            </Avatar>
                        </ListItemAvatar>
                        <ListItemText
                            primary={competition.location ? competition.location : competition.club?.abbr}
                            secondary={competition.location && competition.club?.abbr}
                        />
                    </ListItem>
                )}

                {/* Contact Email */}
                <ListItem>
                    <ListItemAvatar>
                        <Avatar sx={{ backgroundColor: 'primary.main', width: 36, height: 36 }}>
                            <FontAwesomeIcon icon={faEnvelope} size="sm" color="white" />
                        </Avatar>
                    </ListItemAvatar>
                    <ListItemText
                        primary={<Link href={`mailto:${competition.email}`}>{competition.email}</Link>}
                        sx={{ wordBreak: 'break-all' }}
                    />
                </ListItem>

                {/* Contact Phone */}
                {competition.phone && (
                    <ListItem>
                        <ListItemAvatar>
                            <Avatar sx={{ backgroundColor: 'primary.main', width: 36, height: 36 }}>
                                <FontAwesomeIcon icon={faPhone} size="sm" color="white" />
                            </Avatar>
                        </ListItemAvatar>
                        <ListItemText
                            primary={competition.phone}
                        />
                    </ListItem>
                )}
            </List>
        </Card>
    )
}
