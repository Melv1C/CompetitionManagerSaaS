import { faUsers } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Box, Button } from '@mui/material';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { ManageParticipantsModal } from '../components/ManageParticipantsModal';
import { ParticipantsSelector } from '../components/ParticipantsSelector';
import { AddHeightForm } from './AddHeightForm';
import { HeightKeyboard } from './HeightKeyboard';
import { HeightsTable } from './HeightsTable';
import { useHeightResults, useInputHandling, useNextInput } from './hooks';
import { HeightEncodeProps } from './types';
import {
    hasSucceededHeight,
    isAthleteRetired,
    isHeightDisabled,
} from './utils';
import { useDeviceSize } from '@/hooks';

export const HeightEncode: React.FC<HeightEncodeProps> = ({ event }) => {
    const { t } = useTranslation();
    const { isMobile, isTablet } = useDeviceSize();
    const isSmallScreen = isMobile || isTablet;
    const [manageParticipantsOpen, setManageParticipantsOpen] = useState(false);

    // Get results and heights state
    const {
        results,
        heights,
        showVirtualKeyboard,
        currentInput,
        setCurrentInput,
        setShowVirtualKeyboard,
        sendResult,
        addHeight,
    } = useHeightResults(event.id);

    // Get utility for finding next input
    const { findNextInput } = useNextInput(results, heights);

    // Setup input handling
    const {
        handleInputFocus,
        handleInputChange,
        handleEnterPressed,
        handleKeyboardClose,
    } = useInputHandling(
        results,
        heights,
        currentInput,
        setCurrentInput,
        setShowVirtualKeyboard,
        sendResult,
        findNextInput
    );

    // If no results are available yet, show the participants selector
    if (results.length === 0) {
        return (
            <ParticipantsSelector event={event} onResultsCreated={() => {}} />
        );
    }

    return (
        <Box sx={{ display: 'flex', flexDirection: 'column' }}>
            <Box
                sx={{
                    display: 'flex',
                    flexDirection: isSmallScreen ? 'column' : 'row',
                    justifyContent: 'space-between',
                    alignItems: isSmallScreen ? 'stretch' : 'center',
                    gap: isSmallScreen ? 2 : 0,
                    mb: 2,
                }}
            >
                <Button
                    fullWidth={isSmallScreen}
                    variant="outlined"
                    startIcon={<FontAwesomeIcon icon={faUsers} />}
                    onClick={() => setManageParticipantsOpen(true)}
                    sx={{ py: 1, px: 4 }}
                >
                    {t('result:manageParticipants')}
                </Button>

                <AddHeightForm
                    onAddHeight={addHeight}
                    existingHeights={heights}
                />
            </Box>

            <HeightsTable
                heights={heights}
                results={results}
                handleInputFocus={handleInputFocus}
                currentInput={currentInput}
                isHeightDisabled={(resultId, heightIndex) =>
                    isHeightDisabled(resultId, heightIndex, heights, results)
                }
                isAthleteRetired={(resultId) =>
                    isAthleteRetired(resultId, results)
                }
                hasSucceededHeight={(resultId, heightValue) =>
                    hasSucceededHeight(resultId, heightValue, results)
                }
            />

            <HeightKeyboard
                open={showVirtualKeyboard}
                inputValue={
                    results
                        .find((r) => r.id === currentInput.resultId)
                        ?.details.find(
                            (d) => d.tryNumber === currentInput.height
                        )
                        ?.attempts?.join('') || ''
                }
                onKeyboardInput={handleInputChange}
                onEnterPressed={handleEnterPressed}
                onClose={handleKeyboardClose}
            />

            <ManageParticipantsModal
                open={manageParticipantsOpen}
                onClose={() => setManageParticipantsOpen(false)}
                event={event}
                existingResults={results}
            />
        </Box>
    );
};
