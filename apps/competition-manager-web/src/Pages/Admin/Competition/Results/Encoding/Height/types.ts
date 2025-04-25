import { CompetitionEvent, Id, Result } from '@competition-manager/schemas';

export interface HeightEncodeProps {
    event: CompetitionEvent;
}

export interface CurrentInputState {
    resultId: Id;
    height: number;
}

export interface HeightsTableProps {
    heights: number[];
    results: Result[];
    handleInputFocus: (resultId: Id, height: number) => void;
    currentInput: CurrentInputState;
    handleInputChange: (value: string) => void;
    isMobileDevice: boolean;
    isHeightDisabled: (resultId: Id, heightIndex: number) => boolean;
    isAthleteRetired: (resultId: Id) => boolean;
    hasSucceededHeight: (resultId: Id, heightValue: number) => boolean;
    onEnterPressed: () => void;
}
