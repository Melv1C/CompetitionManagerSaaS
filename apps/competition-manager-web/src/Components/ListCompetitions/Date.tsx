import { Box } from "@mui/material";
import i18n from "../../i18n";

type DateProps = {
    date: Date;
}

export const Date: React.FC<DateProps> = ({ date }) => {
    return (
        <Box
            sx={{
                width: '3rem',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                backgroundColor: 'secondary.main',
                border: '2px solid',
                borderColor: 'secondary.main',
                borderRadius: '10px',
                margin: 'auto 0',
            }}
        >
            <Box
                sx={{
                    fontSize: '1rem',
                    fontWeight: 'bold',
                    textAlign: 'center',
                    color: 'white',
                }}
            >
                {date.toLocaleString(i18n.language, { month: 'short' }).charAt(0).toUpperCase() + date.toLocaleString(i18n.language, { month: 'short' }).slice(1)}
            </Box>
            <Box
                sx={{
                    fontSize: '2rem',
                    fontWeight: 'bold',
                    width: '3rem',
                    textAlign: 'center',
                    backgroundColor: 'white',
                    borderRadius: '0 0 8px 8px',
                }}
            >
                {date.getDate()}
            </Box>
        </Box>
    );
}
