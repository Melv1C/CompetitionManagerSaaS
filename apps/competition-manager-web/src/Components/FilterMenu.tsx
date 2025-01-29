import { Checkbox, FormControlLabel, Menu, MenuItem, MenuList } from "@mui/material"
import { useTranslation } from "react-i18next";

type FilterMenuProps = {
    isOpen: boolean;
    onClose: () => void;
    anchorEl: null | HTMLElement;
    items: string[];
    selectedItems: string[];
    setSelectedItems: (items: string[]) => void;
}


export const FilterMenu: React.FC<FilterMenuProps> = ({ 
    isOpen,
    onClose,
    anchorEl,
    items,
    selectedItems,
    setSelectedItems
}) => {

    const { t } = useTranslation();

    return (
        <Menu
            open={isOpen}
            onClose={onClose}
            anchorEl={anchorEl}
        >
            <MenuList dense>
                <MenuItem>
                    <FormControlLabel
                        control={
                            <Checkbox
                                size="small"
                                checked={selectedItems.length === items.length}
                                onChange={() => {
                                    if (selectedItems.length === items.length) {
                                        setSelectedItems([]);
                                    } else {
                                        setSelectedItems(items);
                                    }
                                }}
                            />
                        }
                        label={t('labels:selectAll')}
                    />
                </MenuItem>
                {items.sort().map((item, index) => (
                    <MenuItem
                        key={index}
                    >
                        <FormControlLabel
                            control={
                                <Checkbox
                                    size="small"
                                    checked={selectedItems.includes(item)}
                                    onChange={() => {
                                        if (selectedItems.includes(item)) {
                                            setSelectedItems(selectedItems.filter(i => i !== item));
                                        } else {
                                            setSelectedItems([...selectedItems, item]);
                                        }
                                    }}
                                />
                            }
                            label={item}
                        />
                    </MenuItem>
                ))}
            </MenuList>
        </Menu>
    )
}
