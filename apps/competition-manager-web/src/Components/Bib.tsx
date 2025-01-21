import { Athlete } from "@competition-manager/schemas"
import { Box } from "@mui/material"


type BibProps = {
    value: Athlete['bib']
    size?: 'sm' | 'md' | 'lg'
}

export const Bib: React.FC<BibProps> = ({ 
    value, 
    size = 'md' 
}) => {

    const fontSize = size === 'sm' ? '0.75rem' : size === 'md' ? '1rem' : '1.25rem'
    const fontWeigth = size === 'sm' ? 400 : size === 'md' ? 500 : 600
    const width = size === 'sm' ? 40 : size === 'md' ? 50 : 60
    const height = size === 'sm' ? 30 : size === 'md' ? 40 : 50
    const borderSize = size === 'sm' ? 0 : size === 'md' ? 1 : 2

    return (
        <Box
            display="flex"
            flexDirection="column"
            alignItems="center"
            justifyContent="center"
            width={width}
            height={height}
            bgcolor="primary.main"
            border={borderSize}
            borderColor="primary.main"
        >
            <Box
                height="20%"
            />

            <Box 
                display="flex" 
                justifyContent="center"
                alignItems="center" 
                width="100%"
                height="80%"
                bgcolor="primary.contrastText"
                color="primary.main"
                fontSize={fontSize}
                fontWeight={fontWeigth}
            >
                {value}
            </Box>

            <Box
                height="20%"
            />

        </Box>
    )
}
