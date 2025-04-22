import { CompetitionEvent, Id, ResultDetail } from "@competition-manager/schemas";

export type EncodeProps = {
    event: CompetitionEvent
};


export type LiveOptionsProps = {
    setNbTry: React.Dispatch<React.SetStateAction<number>>;
    updateResultsForNewTryCount: (newTryCount: number) => void;
    inputMode: string;
    setInputMode: React.Dispatch<React.SetStateAction<'value' | 'wind' | 'both'>>;
};

export type CurrentInputState = {
    resultId: Id;
    tryNumber: number;
    type: 'value' | 'wind';
    value: string;
};

export type InputResultProps = {
    resultId: Id;
    tryNumber: number;
    resultDetail: ResultDetail | undefined;
    inputMode: 'value' | 'wind' | 'both';
    handleChange: (value: string) => void;
    handleKeyPress: (event: React.KeyboardEvent<HTMLInputElement>, resultId: Id, tryNumber: number) => void;
    handleInputFocus: (resultId: Id, tryNumber: number, type: 'value' | 'wind') => void;
    handleWindKeyPress: (event: React.KeyboardEvent<HTMLInputElement>, resultId: Id, tryNumber: number) => void;
    currentInput: CurrentInputState;
    handleBlur: (resultId: Id) => void;
};