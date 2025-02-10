
import { Infos } from "./Infos";
import { Descriptions } from "./Descriptions";
import { Events } from "./Events";
import { InscriptionsInfos } from "./InscriptionsInfos";
import { useDeviceSize } from "../../../hooks";
import { Stack } from "@mui/material";
import { useAtomValue } from "jotai";
import { competitionAtom } from "../../../GlobalsStates";


export const Overview = () => {

    const {isTablet, isLaptop, isDesktop} = useDeviceSize();

    const competition = useAtomValue(competitionAtom);
    if (!competition) throw new Error('No competition found');

    if (isDesktop || isLaptop) {
        return (
            <Stack spacing={2} alignItems="center">
                <Stack spacing={2} direction="row">
                    <Stack spacing={2} direction={competition.description ? "column" : "row"}>
                        <Infos />
                        <InscriptionsInfos />
                    </Stack>
                    <Descriptions />
                </Stack>
                <Stack spacing={2} direction="row">
                    <Events />
                </Stack>
            </Stack>
        )
    }

    if (isTablet) {
        return (
            <Stack spacing={2} alignItems="center">
                <Stack spacing={2} direction="row">
                    <Infos />
                    <InscriptionsInfos />
                </Stack>
                <Descriptions />
                <Stack spacing={2} direction="row">
                    <Events />
                </Stack>
            </Stack>
        )
    }

    // Mobile (default)
    return (
        <Stack spacing={2} alignItems="center">
            <Infos />
            <InscriptionsInfos />
            <Descriptions />
            <Events />
        </Stack>
    )
}
