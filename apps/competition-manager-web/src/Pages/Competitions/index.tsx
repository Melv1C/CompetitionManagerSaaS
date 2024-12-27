import { useEffect, useState } from 'react';
import { getCompetitions } from '../../api';
import { ListCompetitions, Loading } from '../../Components';
import { Competition } from '../../type';
import { MaxWidth } from '../../Components/MaxWidth';


const Competitions: React.FC = () => {
    const [competitions, setCompetitions] = useState<Competition[]>([]);

    useEffect(() => {
        const fetchCompetitions = async () => {
            const competitions = await getCompetitions();
            setCompetitions(competitions);
        }

        fetchCompetitions();
    }, []);

    return (
        <MaxWidth>
            {competitions.length === 0 && <Loading />}
            <ListCompetitions competitions={competitions} isPast={false} />
        </MaxWidth>
    );
};

export default Competitions;