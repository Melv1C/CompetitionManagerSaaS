import { useAtomValue } from "jotai";
import { useTranslation } from "react-i18next";
import { competitionAtom, inscriptionsAtom } from "../../../GlobalsStates";
import {Avatar, Card, Link, List, ListItem, ListItemAvatar, ListItemText } from "@mui/material";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCalendar, faEnvelope, faLocationDot, faUsers } from "@fortawesome/free-solid-svg-icons";


export const Infos = () => {

    const { t } = useTranslation();
        
    const competition = useAtomValue(competitionAtom);
    const inscriptions = useAtomValue(inscriptionsAtom);
    if (!competition) throw new Error('No competition found');
    if (!inscriptions) throw new Error('No inscriptions found');

    const nbParticipants = new Set(inscriptions.map(i => i.athlete.license)).size;

    return (
        <Card 
            sx={{ 
                minWidth: 250,
                height: 'fit-content'
            }}
        >
            <List 
                sx={{
                    p: 2,
                    display: 'flex',
                    flexDirection: 'column',
                    gap: 2,
                }}
            >
                {/* Date */}
                <ListItem>
                    <ListItemAvatar>
                        <Avatar sx={{ backgroundColor: 'primary.main', width: 36, height: 36 }}>
                            <FontAwesomeIcon icon={faCalendar} size="sm" color="white" />
                        </Avatar>
                    </ListItemAvatar>
                    <ListItemText
                        primary={competition.closeDate ? `${competition.date.toLocaleDateString()} - ${competition.closeDate.toLocaleDateString()}` : competition.date.toLocaleDateString()}
                    />
                </ListItem>

                {/* Location */}
                {competition.club && (
                    <ListItem>
                        <ListItemAvatar>
                            <Avatar sx={{ backgroundColor: 'primary.main', width: 36, height: 36 }}>
                                <FontAwesomeIcon icon={faLocationDot} size="sm" color="white" />
                            </Avatar>
                        </ListItemAvatar>
                        <ListItemText
                            primary={competition.club.address}
                            secondary={competition.club.name}
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
                    />
                </ListItem>

                {/* Number of participants */}
                <ListItem>
                    <ListItemAvatar>
                        <Avatar sx={{ backgroundColor: 'primary.main', width: 36, height: 36 }}>
                            <FontAwesomeIcon icon={faUsers} size="sm" color="white" />
                        </Avatar>
                    </ListItemAvatar>
                    <ListItemText
                        primary={`${nbParticipants} ${t('glossary:participants')}`}
                    />
                </ListItem>
            </List>
        </Card>
    )
}
