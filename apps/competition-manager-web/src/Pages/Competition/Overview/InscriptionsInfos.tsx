
import { Card, ListItem, ListItemAvatar, ListItemText, List, Avatar } from '@mui/material';
import { faCalendar, faUsers } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useTranslation } from 'react-i18next';
import { competitionAtom, inscriptionsAtom } from '../../../GlobalsStates';
import { useAtomValue } from 'jotai';

export const InscriptionsInfos = () => {

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
            <List>
                {/* start inscription dateTime */}
                <ListItem>
                    <ListItemAvatar>
                        <Avatar sx={{ backgroundColor: 'primary.main', width: 36, height: 36 }}>
                            <FontAwesomeIcon icon={faCalendar} size="sm" color="white" />
                        </Avatar>
                    </ListItemAvatar>
                    <ListItemText
                        primary={t('labels:startInscriptionDate')}
                        secondary={competition.startInscriptionDate.toLocaleTimeString('fr-FR', { year: 'numeric', month: 'numeric', day: 'numeric', hour: 'numeric', minute: 'numeric' })}
                    />
                </ListItem>

                {/* end inscription dateTime */}
                <ListItem>
                    <ListItemAvatar>
                        <Avatar sx={{ backgroundColor: 'primary.main', width: 36, height: 36 }}>
                            <FontAwesomeIcon icon={faCalendar} size="sm" color="white" />
                        </Avatar>
                    </ListItemAvatar>
                    <ListItemText
                        primary={t('labels:endInscriptionDate')}
                        secondary={competition.endInscriptionDate.toLocaleTimeString('fr-FR', { year: 'numeric', month: 'numeric', day: 'numeric', hour: 'numeric', minute: 'numeric' })}
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
