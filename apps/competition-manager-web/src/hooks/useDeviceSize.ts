import { useMediaQuery } from "@mui/material";

export const useDeviceSize = () => {
    return {
        isMobile: useMediaQuery('(max-width: 600px)'),
        isTablet: useMediaQuery('(min-width: 601px) and (max-width: 900px)'),
        isLaptop: useMediaQuery('(min-width: 901px) and (max-width: 1200px)'),
        isDesktop: useMediaQuery('(min-width: 1201px)'),
    }
}