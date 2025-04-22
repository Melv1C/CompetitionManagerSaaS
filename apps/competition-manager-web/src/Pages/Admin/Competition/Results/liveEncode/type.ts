import { CompetitionEvent } from "@competition-manager/schemas";

export type EncodeProps = {
    event: CompetitionEvent
};

export type ResultData = {
    tries: (string | null)[],
    wind?: (string | null)[]
};


export type ResultsData = {
    [key: string]: 
};



export type LiveOptionsProps = {
    setNbTry: React.Dispatch<React.SetStateAction<number>>;
    updateResultsForNewTryCount: (newTryCount: number) => void;
    inputMode: string;
    setInputMode: React.Dispatch<React.SetStateAction<'perf' | 'wind' | 'both'>>;
};

export type InputResultProps = {
    inscription: any;
    tryIndex: number;
    rowIndex: number;
    results: ResultsData;
    handleKeyPress: (event: React.KeyboardEvent<HTMLInputElement>, tryIndex: number, rowIndex: number, inscriptionId: string) => void;
    handleInputFocus: (event: React.FocusEvent<HTMLInputElement>, inputId: string) => void;
    inputMode: 'perf' | 'wind' | 'both' | 'height';
    handleWindKeyPress: (event: React.KeyboardEvent<HTMLInputElement>, tryIndex: number, rowIndex: number) => void;
    handleResultChange: (inscriptionId: string, tryIndex: number, value: string) => void;
    handleWindChange: (inscriptionId: string, tryIndex: number, value: string) => void;
};