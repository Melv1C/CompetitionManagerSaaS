import { useQuery } from "react-query";
import { getCompetitions } from '../../api';
import { ListCompetitions, Loading } from '../../Components';
import { MaxWidth } from '../../Components/MaxWidth';
import { useSearchParams } from "react-router-dom";
import { Typography } from "@mui/material";
import { useTranslation } from "react-i18next";

const today = new Date();
today.setHours(0, 0, 0, 0);
const tomorrow = new Date(today);
tomorrow.setDate(tomorrow.getDate() + 1);

export const Competitions: React.FC = () => {

    const { t } = useTranslation();

    const [searchParams] = useSearchParams();
    const isPast = searchParams.get('isPast') === 'true';

    const { data: competitions, isLoading, isError } = useQuery(
        ['competitions', isPast], 
        () => getCompetitions({ from: isPast ? undefined : today, to: isPast ? tomorrow : undefined })
    );

    if (isLoading) return <Loading />;
    if (isError) throw new Error('Error fetching competitions');
    if (!competitions) throw new Error('Unexpected error: competitions is undefined');

    

    return (
        <MaxWidth>
            <Typography variant="h4" align="center" gutterBottom>
                {isPast ? t('glossary:results') : t('navigation:calendar')}
            </Typography>
            <ListCompetitions competitions={competitions} isPast={isPast} />
        </MaxWidth>
    );
};
