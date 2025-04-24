import { Box, TextField } from "@mui/material";
import React from "react";
import { ResultData } from "./type";
import { AttemptValue, ResultCode } from "@competition-manager/schemas";

type InputResultHeightProps = {
    inscription: any;
    tryIndex: number;
    rowIndex: number;
    result: ResultData;
    handleInputFocus: (event: React.FocusEvent<HTMLInputElement>, inputId: string) => void;
    handleResultChange: (inscriptionId: string, tryIndex: number, value: AttemptValue | ResultCode | string | undefined) => void;
    handleKeyPress: (
        event: React.KeyboardEvent<HTMLInputElement>, 
        tryIndex: number, 
        rowIndex: number, 
        inscriptionId: string,
        subIndex?: number
    ) => void;
};

export const InputResultHeight = ({
    inscription,
    tryIndex,
    rowIndex,
    result,
    handleInputFocus,
    handleResultChange,
    handleKeyPress
}: InputResultHeightProps) => {
    console.log(result)
    return (
        <Box sx={{ display: 'flex', justifyContent: 'center', gap: '2px' }}>
            <TextField
                id={`result-${inscription.id}-${tryIndex}`}
                variant="outlined"
                size="small"
                inputProps={{
                    style: {
                        padding: '8px',
                        width: '20px',
                        height: '20px',
                        textAlign: 'center'
                    },
                    maxLength: 1
                }}
                value={result.tries}
                onChange={(e) => handleResultChange(inscription.id.toString(), tryIndex, e.target.value)}
                onFocus={(e) => handleInputFocus(e as React.FocusEvent<HTMLInputElement>, `result-${inscription.id}-${tryIndex}`)}
                onKeyDown={(e) => handleKeyPress(e as React.KeyboardEvent<HTMLInputElement>, tryIndex, rowIndex, inscription.id.toString())}
            />
        </Box>
    );
};