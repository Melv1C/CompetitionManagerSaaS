import { inscriptionsAtom } from '@/GlobalsStates';
import { Card, Typography } from '@mui/material';
import { pieArcLabelClasses, PieChart } from '@mui/x-charts/PieChart';
import { useAtomValue } from 'jotai';
import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';

export const ClubsPie = () => {
    const { t } = useTranslation();

    const inscriptions = useAtomValue(inscriptionsAtom);
    if (!inscriptions) throw new Error('No inscriptions found');

    // First get unique athletes with their clubs by license
    const uniqueAthletesWithClubs = useMemo(() => {
        const athletesMap = new Map();
        inscriptions.forEach((inscription) => {
            if (!athletesMap.has(inscription.athlete.license)) {
                athletesMap.set(inscription.athlete.license, {
                    athlete: inscription.athlete,
                    club: inscription.club,
                });
            }
        });
        return Array.from(athletesMap.values());
    }, [inscriptions]);

    // Then get unique clubs from unique athletes
    const clubsId = useMemo(
        () => new Set(uniqueAthletesWithClubs.map((item) => item.club.id)),
        [uniqueAthletesWithClubs]
    );

    if (uniqueAthletesWithClubs.length === 0) return null;
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
                series={[
                    {
                        data: Array.from(clubsId).map((clubId) => ({
                            id: clubId,
                            value: uniqueAthletesWithClubs.filter(
                                (item) => item.club.id === clubId
                            ).length,
                            label: uniqueAthletesWithClubs.find(
                                (item) => item.club.id === clubId
                            )?.club.abbr,
                        })),
                        arcLabel: 'label',
                        arcLabelMinAngle: 30,
                    },
                ]}
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
    );
};
