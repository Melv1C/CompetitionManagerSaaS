/**
 * File: apps/competition-manager-web/src/Pages/FAQ/Components/FAQAnswer.tsx
 * 
 * Base component for rendering FAQ answers. This component provides a consistent
 * layout and styling for all FAQ answers, supporting both simple text content
 * and complex content with images.
 * 
 * Features:
 * - Supports both simple text and complex React components as content
 * - Optional image support with responsive sizing
 * - Consistent styling and spacing
 * 
 * Usage example:
 * ```tsx
 * // Simple text answer
 * <FAQAnswer content="This is a simple text answer" />
 * 
 * // Complex content with image
 * <FAQAnswer
 *   content={<>
 *     <Typography>Complex content here</Typography>
 *     <List>...</List>
 *   </>}
 *   image={{
 *     src: "/path/to/image.png",
 *     alt: "Descriptive text"
 *   }}
 * />
 * ```
 */

import { ReactNode } from 'react'
import { Typography, Box } from '@mui/material'

/**
 * Props for the FAQAnswer component
 * @interface FAQAnswerProps
 * @property {string | ReactNode} content - The content to display. Can be either a simple string or a complex React node
 * @property {Object} [image] - Optional image configuration
 * @property {string} image.src - The source URL of the image
 * @property {string} image.alt - Alt text for the image
 */
interface FAQAnswerProps {
    // Allow either simple text or complex content
    content: string | ReactNode
    // Optional image props
    image?: {
        src: string
        alt: string
    }
}

/**
 * A reusable component for displaying FAQ answers with consistent styling
 * 
 * @component
 * @param {FAQAnswerProps} props - The component props
 * @returns {ReactNode} The rendered FAQ answer
 */
export const FAQAnswer = ({ content, image }: FAQAnswerProps) => {
    return (
        <Box>
            {/* If content is a string, wrap it in Typography, otherwise render as is */}
            {typeof content === 'string' ? (
                <Typography>{content}</Typography>
            ) : (
                content
            )}
            
            {/* Render image if provided */}
            {image && (
                <Box 
                    component="img"
                    src={image.src}
                    alt={image.alt}
                    sx={{
                        maxWidth: '100%',
                        height: 'auto',
                        mt: 2,
                        borderRadius: 1,
                    }}
                />
            )}
        </Box>
    )
} 