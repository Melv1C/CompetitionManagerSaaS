import { useQuery } from "react-query";
import { getCompetitions } from '../../api';
import { ListCompetitions, Loading } from '../../Components';
import { MaxWidth } from '../../Components/MaxWidth';


export const Competitions: React.FC = () => {
    const { data: competitions, isLoading, isError } = useQuery('competitions', () => getCompetitions());

    if (isLoading) return <Loading />;
    if (isError) throw new Error('Error fetching competitions');
    if (!competitions) throw new Error('Unexpected error: competitions is undefined');

    return (
        <MaxWidth>
            <ListCompetitions competitions={competitions} isPast={false} />
        </MaxWidth>
    );
};
