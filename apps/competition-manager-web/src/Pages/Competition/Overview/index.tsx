import { MaxWidth } from '@/Components';
import { competitionAtom } from '@/GlobalsStates';
import { useDeviceSize } from '@/hooks';
import { Stack } from '@mui/material';
import Grid from '@mui/material/Grid2';
import { useAtomValue } from 'jotai';
import { CategoriesPie } from './CategoriesPie';
import { ClubsPie } from './ClubsPie';
import { Descriptions } from './Descriptions';
import { Events } from './Events';
import { Infos } from './Infos';
import { InscriptionsInfos } from './InscriptionsInfos';

export const Overview = () => {
    const { isLaptop, isDesktop } = useDeviceSize();

    const competition = useAtomValue(competitionAtom);
    if (!competition) throw new Error('No competition found');

    if (isDesktop || isLaptop) {
        return (
            <Grid container spacing={2}>
                <Grid size={competition.description ? 6 : 12}>
                    <Grid container spacing={2}>
                        <Grid size={12}>
                            <Infos />
                        </Grid>
                        <Grid size={12}>
                            <InscriptionsInfos />
                        </Grid>
                    </Grid>
                </Grid>
                <Grid size={6}>
                    <Descriptions />
                </Grid>
                <Grid size={12}>
                    <Stack spacing={2} direction="row" justifyContent="center">
                        <Events />
                    </Stack>
                </Grid>
                <Grid size={6}>
                    <ClubsPie />
                </Grid>
                <Grid size={6}>
                    <CategoriesPie />
                </Grid>
            </Grid>
        );
    }

    // Tablet and mobile
    return (
        <MaxWidth maxWidth="sm">
            <Grid container spacing={2}>
                <Grid size={12}>
                    <Infos />
                </Grid>
                <Grid size={12}>
                    <InscriptionsInfos />
                </Grid>
                <Grid size={12}>
                    <Descriptions />
                </Grid>
                <Grid size={12}>
                    <Stack
                        spacing={2}
                        direction="column"
                        justifyContent="center"
                    >
                        <Events />
                    </Stack>
                </Grid>
                <Grid size={12}>
                    <ClubsPie />
                </Grid>
                <Grid size={12}>
                    <CategoriesPie />
                </Grid>
            </Grid>
        </MaxWidth>
    );
};
