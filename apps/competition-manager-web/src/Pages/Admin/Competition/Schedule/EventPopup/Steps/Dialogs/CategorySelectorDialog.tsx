import { Category, Gender } from '@competition-manager/schemas';
import {
    Button,
    Checkbox,
    Dialog,
    DialogTitle,
    List,
    ListItemButton,
} from '@mui/material';
import Grid from '@mui/material/Grid2';
import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';

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
    const { t } = useTranslation('eventPopup');

    const [selectedCategories, setSelectedCategories] = useState<Category[]>(
        initialSelectedCategories
    );

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

    const isAllChecked = (gender: Gender) => {
        const genderCategories = categories.filter(
            (category) => category.gender === gender
        );
        return (
            genderCategories.length ===
            selectedCategories.filter((category) => category.gender === gender)
                .length
        );
    };

    const handleToggleAll = (gender: Gender) => {
        const genderCategories = categories.filter(
            (category) => category.gender === gender
        );
        if (isAllChecked(gender)) {
            setSelectedCategories(
                selectedCategories.filter(
                    (category) => category.gender !== gender
                )
            );
        } else {
            setSelectedCategories([
                ...selectedCategories.filter(
                    (category) => category.gender !== gender
                ),
                ...genderCategories,
            ]);
        }
    };

    return (
        <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
            <DialogTitle>{t('selectCategories')}</DialogTitle>
            <Grid container spacing={2} overflow={'auto'}>
                <Grid size={6}>
                    <List>
                        <ListItemButton
                            onClick={() => handleToggleAll(Gender.M)}
                        >
                            <Checkbox
                                checked={isAllChecked(Gender.M)}
                                tabIndex={-1}
                                disableRipple
                            />
                            {t('labels:selectAll')}
                        </ListItemButton>
                        {categories
                            .filter((category) => category.gender === Gender.M)
                            .sort((a, b) => a.order - b.order)
                            .map((category) => (
                                <ListItemButton
                                    key={category.id}
                                    onClick={handleToggle(category)}
                                >
                                    <Checkbox
                                        checked={
                                            selectedCategories
                                                .map((category) => category.id)
                                                .indexOf(category.id) !== -1
                                        }
                                        tabIndex={-1}
                                        disableRipple
                                    />
                                    {category.name}
                                </ListItemButton>
                            ))}
                    </List>
                </Grid>
                <Grid size={6}>
                    <List>
                        <ListItemButton
                            onClick={() => handleToggleAll(Gender.F)}
                        >
                            <Checkbox
                                checked={isAllChecked(Gender.F)}
                                tabIndex={-1}
                                disableRipple
                            />
                            {t('labels:selectAll')}
                        </ListItemButton>
                        {categories
                            .filter((category) => category.gender === Gender.F)
                            .sort((a, b) => a.order - b.order)
                            .map((category) => (
                                <ListItemButton
                                    key={category.id}
                                    onClick={handleToggle(category)}
                                >
                                    <Checkbox
                                        checked={
                                            selectedCategories
                                                .map((category) => category.id)
                                                .indexOf(category.id) !== -1
                                        }
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
                variant="contained"
                sx={{
                    margin: 2,
                }}
            >
                {t('buttons:validate')}
            </Button>
        </Dialog>
    );
};
