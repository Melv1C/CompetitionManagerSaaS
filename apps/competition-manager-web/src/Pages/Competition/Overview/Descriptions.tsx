import { WysiwygViewer } from '@/Components';
import { competitionAtom } from '@/GlobalsStates';
import { Card } from '@mui/material';
import { useAtomValue } from 'jotai';

export const Descriptions = () => {
    const competition = useAtomValue(competitionAtom);
    if (!competition) throw new Error('No competition found');

    if (!competition.description) return null;

    return (
        <Card
            sx={{
                minWidth: 250,
                height: 'fit-content',
            }}
        >
            <WysiwygViewer value={competition.description} />
        </Card>
    );
};
