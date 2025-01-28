import { Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from "@mui/material"
import { useAtomValue } from "jotai";
import { useTranslation } from "react-i18next"
import { competitionAtom, inscriptionsAtom } from "../../GlobalsStates";
import { ShowUsersNumber } from "../../Components";


export const Schedule = () => {

    const { t } = useTranslation();

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
                <TableHead>
                    <TableRow>
                        <TableCell width={50}>{t('labels:schedule')}</TableCell>
                        <TableCell>{t('glossary:event')}</TableCell>
                        <TableCell></TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {events.map(event => (
                        <TableRow key={event.id}>
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
