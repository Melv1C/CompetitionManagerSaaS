import { getCompetitions } from '@/api';
import { ListCompetitions, Loading } from '@/Components';
import { MaxWidth } from '@/Components/MaxWidth';
import { useQuery } from 'react-query';
import { useSearchParams } from 'react-router-dom';

const today = new Date();
today.setHours(0, 0, 0, 0);
const tomorrow = new Date();
tomorrow.setHours(23, 59, 59, 999);

export const Competitions: React.FC = () => {
    const [searchParams] = useSearchParams();
    const isPast = searchParams.get('isPast') === 'true';

    const {
        data: competitions,
        isLoading,
        isError,
    } = useQuery(['competitions', isPast], () =>
        getCompetitions({
            from: isPast ? undefined : today,
            to: isPast ? tomorrow : undefined,
        })
    );

    if (isLoading) return <Loading />;
    if (isError) throw new Error('Error fetching competitions');
    if (!competitions)
        throw new Error('Unexpected error: competitions is undefined');

    return (
        <MaxWidth>
            <ListCompetitions competitions={competitions} isPast={isPast} />
        </MaxWidth>
    );
};
