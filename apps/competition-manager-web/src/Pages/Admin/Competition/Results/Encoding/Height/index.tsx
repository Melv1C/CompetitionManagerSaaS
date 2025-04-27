import { Box } from '@mui/material';
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

export const HeightEncode: React.FC<HeightEncodeProps> = ({ event }) => {
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
            <AddHeightForm onAddHeight={addHeight} existingHeights={heights} />

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
        </Box>
    );
};
