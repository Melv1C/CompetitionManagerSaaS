import { useQuery } from "react-query";
import { getCompetitions } from '../../api';
import { ListCompetitions, Loading } from '../../Components';
import { MaxWidth } from '../../Components/MaxWidth';


const Competitions: React.FC = () => {
    const { data: competitions, isLoading } = useQuery('competitions', () => getCompetitions());

    if (isLoading) return <Loading />;

    if (!competitions) throw new Error('No competitions found');

    return (
        <MaxWidth>
            <ListCompetitions competitions={competitions} isPast={false} />
        </MaxWidth>
    );
};

export default Competitions;