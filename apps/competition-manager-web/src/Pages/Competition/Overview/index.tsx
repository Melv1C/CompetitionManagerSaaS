
import { Infos } from "./Infos";
import { Descriptions } from "./Descriptions";
import { Events } from "./Events";
import { InscriptionsInfos } from "./InscriptionsInfos";
import { useDeviceSize } from "../../../hooks";
import { Stack } from "@mui/material";


export const Overview = () => {

    const {isTablet, isLaptop, isDesktop} = useDeviceSize();

    if (isDesktop || isLaptop) {
        return (
            <Stack spacing={2} alignItems="center">
                <Stack spacing={2} direction="row">
                    <Stack spacing={2}>
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
