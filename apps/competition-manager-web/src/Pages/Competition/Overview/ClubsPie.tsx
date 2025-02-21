import { Card, Typography } from '@mui/material';
import { pieArcLabelClasses, PieChart } from '@mui/x-charts/PieChart';
import { useAtomValue } from 'jotai';
import { inscriptionsAtom } from '../../../GlobalsStates';
import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';

export const ClubsPie = () => {

    const { t } = useTranslation();

    const inscriptions = useAtomValue(inscriptionsAtom);
    if (!inscriptions) throw new Error('No inscriptions found');

    const clubsId = useMemo(() => new Set(inscriptions.map((i) => i.club.id)), [inscriptions]);

    if (inscriptions.length === 0) return null;
    return (
        <Card 
            sx={{ 
                height: 'fit-content',
                padding: 2,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
            }}
        >
            <Typography variant="h6">{t('glossary:clubs')}</Typography>
            <PieChart 
                series={[{
                    data: Array.from(clubsId).map((clubsId) => ({
                        id: clubsId,
                        value: inscriptions.filter((i) => i.club.id === clubsId).length,
                        label: inscriptions.find((i) => i.club.id === clubsId)?.club.abbr
                    })),
                    arcLabel: 'label',
                    arcLabelMinAngle: 30,
                }]}
                width={200}
                height={200}
                margin={{ right: 5 }}
                slotProps={{
                    legend: { hidden: true },
                }}
                sx={{
                    [`& .${pieArcLabelClasses.root}`]: {
                        fill: 'white',
                    },
                  }}
            />
        </Card>
    )
}
