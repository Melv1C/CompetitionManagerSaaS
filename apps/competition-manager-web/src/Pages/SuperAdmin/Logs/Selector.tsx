import { Box, Chip, Typography } from "@mui/material";
import { useTranslation } from "react-i18next";

type SelectorProps = {
    label: string;
    items: string[];
    selectedItems: string[];
    setSelectedItems: (items: string[]) => void;
}

export const Selector: React.FC<SelectorProps> = ({ 
    label,
    items,
    selectedItems,
    setSelectedItems,
}) => {
    const { t } = useTranslation();

    return (
        <Box 
            sx={{
                display: 'flex',
                gap: 1,
                flexWrap: 'wrap',
            }}
        >
            <Typography 
                variant="h6"
                sx={{
                    minWidth: 100,
                }}
            >
                {label}
            </Typography>

            <Chip 
                label={t('glossary:all')}
                variant={selectedItems.length === items.length ? 'filled' : 'outlined'}
                color="primary"
                onClick={() => {
                    if (selectedItems.length === items.length) {
                        setSelectedItems([]);
                    } else {
                        setSelectedItems(items);
                    }
                }}
            />
            {items.map((item, index) => (
                <Chip
                    key={index}
                    label={item}
                    variant={selectedItems.includes(item) ? 'filled' : 'outlined'}
                    color="primary"
                    onClick={() => {
                        if (selectedItems.includes(item)) {
                            setSelectedItems(selectedItems.filter(i => i !== item));
                        } else {
                            setSelectedItems([...selectedItems, item]);
                        }
                    }}
                />
            ))}
        </Box>
    )
}
