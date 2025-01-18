import { useMediaQuery } from "@mui/material";

export const useDeviceSize = () => {
    return {
        isMobile: useMediaQuery('(max-width: 600px)'),
        isTablet: useMediaQuery('(max-width: 1024px)'),
        isDesktop: useMediaQuery('(min-width: 1025px)'),
    }
}