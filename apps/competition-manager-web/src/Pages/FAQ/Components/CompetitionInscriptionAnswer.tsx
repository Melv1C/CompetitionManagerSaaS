/**
 * File: apps/competition-manager-web/src/Pages/FAQ/Components/CompetitionInscriptionAnswer.tsx
 *
 * Component that provides comprehensive instructions for managing competition inscriptions.
 * This component handles all aspects of inscription management including creation,
 * modification, and deletion of competition registrations.
 *
 * Features:
 * - Step-by-step instructions for all inscription operations
 * - Clear section separation with dividers
 * - Warning alerts for important policies
 * - Internationalization support
 * - Consistent styling with other FAQ answers
 *
 * Component Structure:
 * - Introduction section
 * - Creation section (3 steps)
 * - Modification section (2 steps)
 * - Deletion section with warnings
 *
 * Translation keys used:
 * - inscription.intro
 * - inscription.create.*
 *   - title
 *   - step1.title/description
 *   - step2.title/description
 *   - step3.title/description
 * - inscription.modify.*
 *   - title
 *   - step1.title/description
 *   - step2.title/description
 * - inscription.delete.*
 *   - title
 *   - description
 *   - warning
 *
 * Usage example:
 * ```tsx
 * <CompetitionInscriptionAnswer />
 * ```
 *
 * @see FAQAnswer - Base component used for consistent styling
 * @see FAQ/index.tsx - Parent component where this is used
 */

import {
    Alert,
    Divider,
    List,
    ListItem,
    ListItemText,
    Typography,
} from '@mui/material';
import { useTranslation } from 'react-i18next';
import { FAQAnswer } from './FAQAnswer';

/**
 * Component that displays comprehensive instructions for managing competition inscriptions.
 * Organized into three main sections: creation, modification, and deletion of inscriptions.
 *
 * @component
 * @returns {ReactNode} The rendered inscription management instructions
 */
export const CompetitionInscriptionAnswer = () => {
    // Initialize translation hook with 'faq' namespace
    const { t } = useTranslation('faq');

    return (
        <FAQAnswer
            content={
                <>
                    {/* General introduction section */}
                    <Typography sx={{ mb: 2 }}>
                        {t('inscription.intro')}
                    </Typography>

                    {/* Section 1: Creating a new inscription */}
                    <Typography variant="h6" gutterBottom>
                        {t('inscription.create.title')}
                    </Typography>
                    <List>
                        {/* Step 1: Competition Selection */}
                        <ListItem>
                            <ListItemText
                                primary={t('inscription.create.step1.title')}
                                secondary={t(
                                    'inscription.create.step1.description'
                                )}
                            />
                        </ListItem>
                        {/* Step 2: Details Entry */}
                        <ListItem>
                            <ListItemText
                                primary={t('inscription.create.step2.title')}
                                secondary={t(
                                    'inscription.create.step2.description'
                                )}
                            />
                        </ListItem>
                        {/* Step 3: Payment and Confirmation */}
                        <ListItem>
                            <ListItemText
                                primary={t('inscription.create.step3.title')}
                                secondary={t(
                                    'inscription.create.step3.description'
                                )}
                            />
                        </ListItem>
                    </List>

                    <Divider sx={{ my: 2 }} />

                    {/* Section 2: Modifying an existing inscription */}
                    <Typography variant="h6" gutterBottom>
                        {t('inscription.modify.title')}
                    </Typography>
                    <List>
                        {/* Step 1: Locating the Inscription */}
                        <ListItem>
                            <ListItemText
                                primary={t('inscription.modify.step1.title')}
                                secondary={t(
                                    'inscription.modify.step1.description'
                                )}
                            />
                        </ListItem>
                        {/* Step 2: Making and Saving Changes */}
                        <ListItem>
                            <ListItemText
                                primary={t('inscription.modify.step2.title')}
                                secondary={t(
                                    'inscription.modify.step2.description'
                                )}
                            />
                        </ListItem>
                    </List>

                    <Divider sx={{ my: 2 }} />

                    {/* Section 3: Canceling/Deleting an inscription */}
                    <Typography variant="h6" gutterBottom>
                        {t('inscription.delete.title')}
                    </Typography>
                    <Typography>
                        {t('inscription.delete.description')}
                    </Typography>

                    {/* Important warning about cancellation policies */}
                    <Alert severity="warning" sx={{ mt: 2 }}>
                        {t('inscription.delete.warning')}
                    </Alert>
                </>
            }
        />
    );
};
