import { useState } from "react";
import { BaseFieldWith$Props } from "./BaseFieldWith$";
import { FieldIconWith$ } from "./FieldIconWith$";
import { IconButton } from "@mui/material";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEye, faEyeSlash } from "@fortawesome/free-solid-svg-icons";


export const PasswordFieldWith$: React.FC<BaseFieldWith$Props> = (props) => {

    const [IsPasswordVisible, setIsPasswordVisible] = useState(false);

    const handleClickShow = () => {
        setIsPasswordVisible((prev) => !prev);
    };

    const handleMouseDown = (event: React.MouseEvent<HTMLButtonElement>) => {
        event.preventDefault();
    }

    return (
        <FieldIconWith$ 
            {...props}
            type={IsPasswordVisible ? 'text' : 'password'}
            icon={
                <IconButton
                    aria-label="toggle password visibility"
                    onClick={handleClickShow}
                    onMouseDown={handleMouseDown}
                    sx={{ color: 'text.secondary' }}
                >
                    <FontAwesomeIcon icon={IsPasswordVisible ? faEye : faEyeSlash} size='xs' />
                </IconButton>
            }
        />
    );
};
