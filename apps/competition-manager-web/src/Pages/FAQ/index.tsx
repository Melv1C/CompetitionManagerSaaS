/**
 * File: apps/competition-manager-web/src/Pages/FAQ/index.tsx
 * 
 * Main FAQ (Frequently Asked Questions) page component.
 * This component serves as the container for all FAQ items and provides
 * an accordion-style interface for users to easily find answers to common questions.
 * 
 * Features:
 * - Responsive accordion layout
 * - Internationalization support
 * - Component-based answers for rich content
 * - Consistent styling across all FAQ items
 * - Easy to maintain and extend
 * - "Can't find your answer?" section for additional support
 * 
 * Directory Structure:
 * - /Components
 *   - FAQAnswer.tsx: Base component for answers
 *   - CantFindAnswer.tsx: Support call-to-action component
 *   - Other components: Specialized components for each FAQ item
 * 
 * Translation Structure:
 * The FAQ content is organized in the translation files (en/fr/nl) under the 'faq' namespace:
 * - title: Main page title
 * - questions: Question text for each FAQ item
 * - [section]: Detailed content for each answer section
 * - cantFindAnswer: Translations for the support section
 */

import { 
    Typography, 
    Accordion, 
    AccordionSummary,
    AccordionDetails,
    Paper,
    Stack
} from "@mui/material"
import { MaxWidth } from "../../Components"
import { useTranslation } from "react-i18next"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faChevronDown } from "@fortawesome/free-solid-svg-icons"
//import { FAQAnswer } from "./Components/FAQAnswer"
import { AccountVerificationAnswer } from "./Components/AccountVerificationAnswer"
import { CompetitionInscriptionAnswer } from "./Components/CompetitionInscriptionAnswer"
import { CantFindAnswer } from "./Components/CantFindAnswer"

/**
 * Interface defining the structure of FAQ items
 * @interface FAQItem
 * @property {string} questionKey - Translation key for the question
 * @property {React.ReactNode | string} answer - Component or string for the answer
 */
interface FAQItem {
    questionKey: string
    // Component for complex answers, string key for simple translations
    answer: React.ReactNode | string
}

/**
 * Main FAQ page component that displays all FAQ items in an accordion layout
 * 
 * @component
 * @returns {ReactNode} The rendered FAQ page
 */
export const FAQ = () => {
    // Initialize translation hook with 'faq' namespace
    const { t } = useTranslation('faq')

    /**
     * Array of FAQ items with their respective answers
     * Each item uses either a specialized component for complex answers
     * or a simple translated string for basic answers
     */
    const faqItems: FAQItem[] = [
        {
            questionKey: "questions.accountVerification",
            answer: <AccountVerificationAnswer />
        },
        {
            questionKey: "questions.inscription",
            answer: <CompetitionInscriptionAnswer />
        }
    ]

    return (
        <MaxWidth>
            <Stack spacing={3} sx={{ py: 4 }}>
                {/* Page Title */}
                <Typography variant="h4" gutterBottom>
                    {t('title')}
                </Typography>
                
                {/* FAQ Items Container */}
                <Paper elevation={2} sx={{ p: 2 }}>
                    {faqItems.map((item, index) => (
                        <Accordion
                            key={index}
                            sx={{
                                '&:not(:last-child)': { borderBottom: 1, borderColor: 'divider' },
                                '&:before': { display: 'none' },
                                boxShadow: 'none',
                            }}
                        >
                            {/* Question Header */}
                            <AccordionSummary
                                expandIcon={<FontAwesomeIcon icon={faChevronDown} />}
                                sx={{ 
                                    '&:hover': { bgcolor: 'action.hover' }
                                }}
                            >
                                <Typography variant="subtitle1" fontWeight="medium">
                                    {t(item.questionKey)}
                                </Typography>
                            </AccordionSummary>
                            {/* Answer Content */}
                            <AccordionDetails>
                                {item.answer}
                            </AccordionDetails>
                        </Accordion>
                    ))}
                </Paper>

                {/* Support call-to-action section */}
                <CantFindAnswer />
            </Stack>
        </MaxWidth>
    )
}
