import { InscriptionWizard } from '@/Components';
import { competitionAtom } from '@/GlobalsStates';
import { useRoles } from '@/hooks';
import i18n from '@/i18n';
import { Alert, AlertTitle, Button } from '@mui/material';
import { useAtomValue } from 'jotai';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';

export const Inscription = () => {
    const { t } = useTranslation();

    const naviqate = useNavigate();

    const competition = useAtomValue(competitionAtom);
    if (!competition) throw new Error('No competition found');

    const { isNotLogged, isUser } = useRoles();

    if (isNotLogged) {
        // Need to be connected to make an inscription
        return (
            <Alert severity="info">{t('competition:needToBeConnected')}</Alert>
        );
    }

    if (!isUser) {
        // Need to have a verified account to make an inscription
        return (
            <Alert severity="info">
                <AlertTitle>{t('competition:needToBeVerified')}</AlertTitle>
                <Button onClick={() => naviqate('/account')}>
                    {t('competition:goToAccount')}
                </Button>
            </Alert>
        );
    }

    if (competition.startInscriptionDate > new Date()) {
        // Inscriptions are not open yet
        return (
            <Alert severity="info">
                <AlertTitle>{t('competition:inscriptionsNotOpen')}</AlertTitle>
                {t('competition:inscriptionsOpenAt', {
                    date: competition.startInscriptionDate.toLocaleString(
                        i18n.language,
                        {
                            day: 'numeric',
                            month: 'long',
                            year: 'numeric',
                            hour: 'numeric',
                            minute: 'numeric',
                        }
                    ),
                })}
            </Alert>
        );
    }

    if (competition.endInscriptionDate < new Date()) {
        // Inscriptions are closed
        return (
            <Alert severity="info">{t('competition:inscriptionsClosed')}</Alert>
        );
    }

    if (competition.events.length === 0) {
        // No event in the competition
        return <Alert severity="info">{t('competition:noEvent')}</Alert>;
    }

    return <InscriptionWizard />;
};
