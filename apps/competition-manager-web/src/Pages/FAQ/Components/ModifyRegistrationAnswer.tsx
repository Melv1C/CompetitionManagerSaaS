/**
 * File: apps/competition-manager-web/src/Pages/FAQ/Components/ModifyRegistrationAnswer.tsx
 *
 * Component that provides information about how to modify an existing registration
 * in the Competition Manager platform.
 */

import { Box, List, ListItem, ListItemText, Typography } from '@mui/material';
import { useTranslation } from 'react-i18next';
import { FAQAnswer } from './FAQAnswer';

/**
 * FAQ answer component that explains how to modify an existing registration
 *
 * @component
 * @returns {ReactNode} The rendered registration modification instructions
 */
export const ModifyRegistrationAnswer = () => {
    // Initialize translation hook with 'faq' namespace
    const { t } = useTranslation('faq');

    return (
        <FAQAnswer
            content={
                <Box>
                    <Typography paragraph>
                        {t('modifyRegistration.intro')}
                    </Typography>

                    <List sx={{ pl: 2 }}>
                        <ListItem sx={{ display: 'list-item' }}>
                            <ListItemText
                                primary={t('modifyRegistration.step1.title')}
                                secondary={t(
                                    'modifyRegistration.step1.description'
                                )}
                                primaryTypographyProps={{
                                    fontWeight: 'medium',
                                }}
                            />
                        </ListItem>
                        <ListItem sx={{ display: 'list-item' }}>
                            <ListItemText
                                primary={t('modifyRegistration.step2.title')}
                                secondary={t(
                                    'modifyRegistration.step2.description'
                                )}
                                primaryTypographyProps={{
                                    fontWeight: 'medium',
                                }}
                            />
                        </ListItem>
                        <ListItem sx={{ display: 'list-item' }}>
                            <ListItemText
                                primary={t('modifyRegistration.step3.title')}
                                secondary={t(
                                    'modifyRegistration.step3.description'
                                )}
                                primaryTypographyProps={{
                                    fontWeight: 'medium',
                                }}
                            />
                        </ListItem>
                        <ListItem sx={{ display: 'list-item' }}>
                            <ListItemText
                                primary={t('modifyRegistration.step4.title')}
                                secondary={t(
                                    'modifyRegistration.step4.description'
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
                        {t('modifyRegistration.note')}
                    </Typography>
                </Box>
            }
        />
    );
};
