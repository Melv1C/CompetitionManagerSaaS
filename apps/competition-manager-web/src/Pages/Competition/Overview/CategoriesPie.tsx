import { competitionAtom, inscriptionsAtom } from '@/GlobalsStates';
import { getCategoryAbbr } from '@competition-manager/utils';
import { Card, Typography } from '@mui/material';
import { pieArcLabelClasses, PieChart } from '@mui/x-charts/PieChart';
import { useAtomValue } from 'jotai';
import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';

export const CategoriesPie = () => {
    const { t } = useTranslation();

    const competition = useAtomValue(competitionAtom);
    const inscriptions = useAtomValue(inscriptionsAtom);
    if (!competition) throw new Error('No competition found');
    if (!inscriptions) throw new Error('No inscriptions found');

    // First get unique athletes by license
    const uniqueAthletes = useMemo(() => {
        const athletesMap = new Map();
        inscriptions.forEach((inscription) => {
            if (!athletesMap.has(inscription.athlete.license)) {
                athletesMap.set(
                    inscription.athlete.license,
                    inscription.athlete
                );
            }
        });
        return Array.from(athletesMap.values());
    }, [inscriptions]);

    // Then get categories from unique athletes
    const categories = useMemo(
        () =>
            new Set(
                uniqueAthletes.map((athlete) =>
                    getCategoryAbbr(
                        athlete.birthdate,
                        athlete.gender,
                        competition.date
                    )
                )
            ),
        [uniqueAthletes, competition]
    );

    if (uniqueAthletes.length === 0) return null;
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
            <Typography variant="h6">{t('glossary:categories')}</Typography>
            <PieChart
                series={[
                    {
                        data: Array.from(categories).map((category) => ({
                            id: category,
                            value: uniqueAthletes.filter(
                                (athlete) =>
                                    getCategoryAbbr(
                                        athlete.birthdate,
                                        athlete.gender,
                                        competition.date
                                    ) === category
                            ).length,
                            label: category,
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
