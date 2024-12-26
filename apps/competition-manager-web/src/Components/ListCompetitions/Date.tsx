import { Box } from "@mui/material";

type DateProps = {
    date: Date;
}

export const Date: React.FC<DateProps> = ({ date }) => {
    return (
        <Box
            sx={{
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
                {date.toLocaleString('en', { month: 'short'})}
            </Box>
            <Box
                sx={{
                    fontSize: '2rem',
                    fontWeight: 'bold',
                    width: '3rem',
                    textAlign: 'center',
                    //color: 'primary.main',
                    backgroundColor: 'white',
                    borderRadius: '0 0 8px 8px',
                }}
            >
                {date.getDate()}
            </Box>
        </Box>
    );
}
