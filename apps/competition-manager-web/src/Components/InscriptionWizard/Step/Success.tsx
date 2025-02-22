import { useSetAtom } from "jotai";
import { useTranslation } from "react-i18next";
import { useLocation, useNavigate, useSearchParams } from "react-router-dom";
import { inscriptionDataAtom } from "../../../GlobalsStates";
import { Alert, AlertTitle, Button, Card, CardActions, CardContent } from "@mui/material";

type SuccessProps = {
    handleResart: () => void;
}

export const Success: React.FC<SuccessProps> = ({
    handleResart
}) => {
    const { t } = useTranslation();

    const navigate = useNavigate();

    const setInscriptionData = useSetAtom(inscriptionDataAtom);

    const [searchParams, setSearchParams] = useSearchParams();
    const location = useLocation();

    const handleNewInscription = () => {
        searchParams.delete('isPending');
        setSearchParams(searchParams);
        setInscriptionData({ athlete: undefined, inscriptionsData: [] });
        handleResart();
    }
    

    const handleMyInscriptions = () => {
        navigate(location.pathname.replace('register', 'inscriptions'));
    }

    const translationBaseKey = searchParams.has('isPending') ? 'competition:pending' : 'competition:success';


    return (
        <Card
            sx={{
                width: '100%',
                margin: 'auto'
            }}
        >
            <CardContent>
                <Alert severity={searchParams.has('isPending') ? 'info' : 'success'}>
                    <AlertTitle>
                        {t(`${translationBaseKey}.title`)}
                    </AlertTitle>
                    {t(`${translationBaseKey}.message`)}
                </Alert>
            </CardContent>
            <CardActions sx={{ justifyContent: 'flex-end' }}>
                <Button variant="outlined" color="primary" onClick={handleNewInscription} sx={{ textTransform: 'none' }}>
                    {t('competition:success.newInscription')}
                </Button>
                <Button variant="contained" color="primary" onClick={handleMyInscriptions} sx={{ textTransform: 'none' }}>
                    {t('competition:success.goToMyInscriptions')}
                </Button>
            </CardActions>
        </Card>
    )
}