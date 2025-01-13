import React, { useState } from 'react';
import { Button, Checkbox, Dialog, DialogTitle, Grid, List, ListItemButton } from '@mui/material';
import { Category, Gender } from '@competition-manager/schemas';



interface CategorySelectorDialogProps {
    categories: Category[];
    initialSelectedCategories: Category[];
    open: boolean;
    onClose: () => void;
    onSelect: (selectedCategories: Category[]) => void;
}

export const CategorySelectorDialog: React.FC<CategorySelectorDialogProps> = ({
    categories,
    initialSelectedCategories,
    open,
    onClose,
    onSelect,
}) => {

    const [selectedCategories, setSelectedCategories] = useState<Category[]>(initialSelectedCategories);

    const handleToggle = (category: Category) => () => {
        const currentIndex = selectedCategories.indexOf(category);
        const newChecked = [...selectedCategories];

        if (currentIndex === -1) {
            newChecked.push(category);
        } else {
            newChecked.splice(currentIndex, 1);
        }

        setSelectedCategories(newChecked);
    };

    return (
        <Dialog 
            open={open} 
            onClose={onClose} 
            fullWidth 
            maxWidth="sm"
        >
            <DialogTitle>Choisir les catégories</DialogTitle>
            <Grid container spacing={2}>
                <Grid item xs={6}>
                    <List>
                        {categories.filter(category => category.gender === Gender.M).map((category) => (
                            <ListItemButton key={category.id} onClick={handleToggle(category)}>
                                <Checkbox
                                    checked={selectedCategories.indexOf(category) !== -1}
                                    tabIndex={-1}
                                    disableRipple
                                />
                                {category.name}
                            </ListItemButton>
                        ))}
                    </List>
                </Grid>
                <Grid item xs={6}>
                    <List>
                        {categories.filter(category => category.gender === Gender.F).map((category) => (
                            <ListItemButton key={category.id} onClick={handleToggle(category)}>
                                <Checkbox
                                    checked={selectedCategories.indexOf(category) !== -1}
                                    tabIndex={-1}
                                    disableRipple
                                />
                                {category.name}
                            </ListItemButton>
                        ))}
                    </List>
                </Grid>
            </Grid>

            <Button 
                onClick={() => {
                    onSelect(selectedCategories);
                    onClose();
                }}
                variant='contained'
                sx={{ 
                    margin: 2,
                }}
            >
                Valider
            </Button>
        </Dialog>
    );
};
