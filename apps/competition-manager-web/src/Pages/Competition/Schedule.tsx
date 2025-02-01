import { Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from "@mui/material"
import { useAtomValue } from "jotai";
import { useTranslation } from "react-i18next"
import { competitionAtom, inscriptionsAtom } from "../../GlobalsStates";
import { ShowUsersNumber } from "../../Components";
import { useNavigate } from "react-router-dom";


export const Schedule = () => {

    const { t } = useTranslation();
    const navigate = useNavigate();

    const competition = useAtomValue(competitionAtom);
    const inscriptions = useAtomValue(inscriptionsAtom);
    if (!competition) throw new Error('No competition found');
    if (!inscriptions) throw new Error('No inscriptions found');

    const events = competition.events;

    return (
        <TableContainer 
            component={Paper}
            sx={{
                width: 'max-content',
                maxWidth: '100%',
                margin: 'auto',
            }}
        >
            <Table size="small">
                <TableHead sx={{ backgroundColor: 'rgba(0, 0, 0, 0.04)' }}>
                    <TableRow>
                        <TableCell width={50}>{t('labels:schedule')}</TableCell>
                        <TableCell>
                            {t('glossary:event')}
                        </TableCell>
                        <TableCell></TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {events.sort((a, b) => a.schedule.getTime() - b.schedule.getTime()).map(event => (
                        <TableRow 
                            key={event.id} 
                            onClick={() => navigate(`/competitions/${competition.eid}/events/${event.eid}`)}
                            sx={{ 
                                cursor: 'pointer',
                                '&:hover': {
                                    backgroundColor: 'rgba(0, 0, 0, 0.04)',
                                    transition: 'background-color 0.3s ease',
                                }
                            }}
                        >
                            <TableCell>{event.schedule.toLocaleTimeString('fr', { hour: '2-digit', minute: '2-digit' })}</TableCell>
                            <TableCell>{event.name}</TableCell>
                            <TableCell align="center"><ShowUsersNumber value={inscriptions.filter(i => i.competitionEvent.id === event.id).length} /></TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </TableContainer>
    )
}
