/**
 * Component for displaying an athlete's inscriptions in an accordion format
 */

import { Accordion, AccordionDetails, AccordionSummary, Chip, IconButton, Link, List, ListItem, Stack, Typography } from '@mui/material';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronDown } from '@fortawesome/free-solid-svg-icons';
import { AthleteWithoutClub, Inscription, InscriptionStatus } from '@competition-manager/schemas';
import { getCategoryAbbr } from '@competition-manager/utils';
import { Bib, Delete, Edit, Time } from '../../../Components';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { formatPerf } from '../../../utils/formatPerf';

interface InscriptionAccordionProps {
    athlete: AthleteWithoutClub;
    inscriptions: Inscription[];
    competitionEid: string;
    competitionDate: Date;
    onEdit?: (athlete: AthleteWithoutClub, inscriptions: Inscription[]) => void;
    onDelete?: (athlete: AthleteWithoutClub, inscriptions: Inscription[]) => void;
    showActions?: boolean;
}

/**
 * Accordion component that displays an athlete's inscriptions with their details
 * Includes athlete info in the summary and a list of events in the details
 */
export const InscriptionAccordion: React.FC<InscriptionAccordionProps> = ({
    athlete,
    inscriptions,
    competitionEid,
    competitionDate,
    onEdit,
    onDelete,
    showActions = false
}) => {
    const { t } = useTranslation();
    const navigate = useNavigate();

    return (
        <Accordion sx={{ mb: 1 }}>
            <AccordionSummary 
                expandIcon={<FontAwesomeIcon icon={faChevronDown} />}
                sx={{
                    '& .MuiAccordionSummary-content': {
                        justifyContent: 'space-between',
                        alignItems: 'center'
                    }
                }}
            >
                <Stack direction="row" spacing={2} alignItems="center">
                    <Bib value={athlete.bib} size="sm" />
                    <Typography>
                        {athlete.firstName} {athlete.lastName}
                    </Typography>
                    <Chip 
                        size="small" 
                        label={getCategoryAbbr(athlete.birthdate, athlete.gender, competitionDate)}
                    />
                    <Chip 
                        size="small" 
                        label={inscriptions[0].club.abbr}
                        color="primary"
                    />
                    <Typography color="text.secondary">
                        ({inscriptions.length} {inscriptions.length > 1 ? t('glossary:events') : t('glossary:event')})
                    </Typography>
                </Stack>
                
                {showActions && (
                    <Stack direction="row" spacing={1} px={1}>
                        <IconButton
                            size="small"
                            onClick={(e) => {
                                e.stopPropagation();
                                onEdit?.(athlete, inscriptions);
                            }}
                            color="primary"
                        >
                            <Edit />
                        </IconButton>
                        <IconButton
                            size="small"
                            onClick={(e) => {
                                e.stopPropagation();
                                onDelete?.(athlete, inscriptions);
                            }}
                            color="error"
                        >
                            <Delete />
                        </IconButton>
                    </Stack>
                )}
            </AccordionSummary>
            <AccordionDetails>
                <List>
                    {inscriptions
                        .sort((a, b) => a.competitionEvent.schedule.getTime() - b.competitionEvent.schedule.getTime())
                        .map((inscription) => (
                            <ListItem
                                key={inscription.eid}
                                sx={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: 2,
                                    py: 1,
                                    bgcolor: 'background.default',
                                    borderRadius: 1,
                                    mb: 0.5
                                }}
                            >
                                <Time date={inscription.competitionEvent.schedule} size="sm" />
                                
                                <Stack direction="row" spacing={2} alignItems="center" flexGrow={1}>
                                    <Link
                                        color="primary"
                                        underline="hover"
                                        onClick={() => navigate(`/competitions/${competitionEid}/events/${inscription.competitionEvent.eid}`)}
                                        sx={{ cursor: 'pointer' }}
                                    >
                                        {inscription.competitionEvent.name}
                                    </Link>
                                    
                                    {inscription.record && (
                                        <Typography variant="body2" color="text.secondary">
                                            ({formatPerf(inscription.record.perf, inscription.competitionEvent.event.type)})
                                        </Typography>
                                    )}
                                    
                                    <Chip 
                                        size="small"
                                        label={t(`enums:inscriptionStatus.${inscription.status}`)}
                                        color={inscription.status === InscriptionStatus.ACCEPTED ? 'success' : 'info'}
                                        variant="outlined"
                                    />
                                </Stack>
                            </ListItem>
                        ))}
                </List>
            </AccordionDetails>
        </Accordion>
    );
}; 