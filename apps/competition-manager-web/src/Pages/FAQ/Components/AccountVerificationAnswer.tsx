/**
 * File: apps/competition-manager-web/src/Pages/FAQ/Components/AccountVerificationAnswer.tsx
 *
 * Component that provides detailed instructions for account verification process.
 * This component uses the base FAQAnswer component to maintain consistent styling
 * while providing step-by-step instructions for verifying a user account.
 *
 * Features:
 * - Step-by-step verification instructions
 * - Internationalization support
 * - Important notes and warnings
 * - Consistent styling with other FAQ answers
 *
 * Translation keys used:
 * - accountVerification.intro
 * - accountVerification.step1.title/description
 * - accountVerification.step2.title/description
 * - accountVerification.step3.title/description
 * - accountVerification.note
 */

import { Alert, List, ListItem, ListItemText, Typography } from '@mui/material';
import { useTranslation } from 'react-i18next';
import { FAQAnswer } from './FAQAnswer';

/**
 * Component that displays the account verification process instructions
 *
 * @component
 * @returns {ReactNode} The rendered account verification instructions
 */
export const AccountVerificationAnswer = () => {
    // Initialize translation hook with 'faq' namespace
    const { t } = useTranslation('faq');

    return (
        <FAQAnswer
            content={
                <>
                    {/* Introduction text */}
                    <Typography sx={{ mb: 2 }}>
                        {t('accountVerification.intro')}
                    </Typography>

                    {/* Step-by-step instructions */}
                    <List>
                        {/* Step 1: Check Email */}
                        <ListItem>
                            <ListItemText
                                primary={t('accountVerification.step1.title')}
                                secondary={t(
                                    'accountVerification.step1.description'
                                )}
                            />
                        </ListItem>
                        {/* Step 2: Click Verification Link */}
                        <ListItem>
                            <ListItemText
                                primary={t('accountVerification.step2.title')}
                                secondary={t(
                                    'accountVerification.step2.description'
                                )}
                            />
                        </ListItem>
                        {/* Step 3: Complete Verification */}
                        <ListItem>
                            <ListItemText
                                primary={t('accountVerification.step3.title')}
                                secondary={t(
                                    'accountVerification.step3.description'
                                )}
                            />
                        </ListItem>
                    </List>

                    {/* Important note about verification email */}
                    <Alert severity="info" sx={{ mt: 2 }}>
                        {t('accountVerification.note')}
                    </Alert>
                </>
            }
        />
    );
};
