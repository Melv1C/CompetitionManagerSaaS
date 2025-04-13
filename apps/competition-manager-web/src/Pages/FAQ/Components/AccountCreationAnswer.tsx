/**
 * File: apps/competition-manager-web/src/Pages/FAQ/Components/AccountCreationAnswer.tsx
 *
 * Component that provides information about how to create an account and log in
 * to the Competition Manager platform.
 */

import { Box, List, ListItem, ListItemText, Typography } from '@mui/material';
import { useTranslation } from 'react-i18next';
import { FAQAnswer } from './FAQAnswer';

/**
 * FAQ answer component that explains how to create an account and log in
 *
 * @component
 * @returns {ReactNode} The rendered account creation and login instructions
 */
export const AccountCreationAnswer = () => {
    // Initialize translation hook with 'faq' namespace
    const { t } = useTranslation('faq');

    return (
        <FAQAnswer
            content={
                <Box>
                    <Typography paragraph>
                        {t('accountCreation.intro')}
                    </Typography>

                    <List sx={{ pl: 2 }}>
                        <ListItem sx={{ display: 'list-item' }}>
                            <ListItemText
                                primary={t('accountCreation.step1.title')}
                                secondary={t(
                                    'accountCreation.step1.description'
                                )}
                                primaryTypographyProps={{
                                    fontWeight: 'medium',
                                }}
                            />
                        </ListItem>
                        <ListItem sx={{ display: 'list-item' }}>
                            <ListItemText
                                primary={t('accountCreation.step2.title')}
                                secondary={t(
                                    'accountCreation.step2.description'
                                )}
                                primaryTypographyProps={{
                                    fontWeight: 'medium',
                                }}
                            />
                        </ListItem>
                        <ListItem sx={{ display: 'list-item' }}>
                            <ListItemText
                                primary={t('accountCreation.step3.title')}
                                secondary={t(
                                    'accountCreation.step3.description'
                                )}
                                primaryTypographyProps={{
                                    fontWeight: 'medium',
                                }}
                            />
                        </ListItem>
                    </List>

                    <Typography
                        variant="body2"
                        sx={{ mt: 2, fontStyle: 'italic' }}
                    >
                        {t('accountCreation.note')}
                    </Typography>
                </Box>
            }
        />
    );
};
