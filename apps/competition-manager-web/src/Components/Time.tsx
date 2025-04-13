import { Avatar } from '@mui/material';

interface TimeProps {
    date: Date;
    size?: 'sm' | 'md' | 'lg';
}

export const Time: React.FC<TimeProps> = ({ 
    date,
    size = 'md'
}) => {
    const dimensions = {
        sm: { width: 40, height: 40, fontSize: '0.8rem' },
        md: { width: 50, height: 50, fontSize: '1rem' },
        lg: { width: 60, height: 60, fontSize: '1.2rem' }
    }[size];

    return (
        <Avatar
            sx={{ 
                bgcolor: 'primary.main',
                color: 'primary.contrastText',
                ...dimensions,
            }}
        >
            {date.toLocaleTimeString('fr', { hour: '2-digit', minute: '2-digit' })}
        </Avatar>
    );
}; 