import { Box, Button, Dialog, FormControl, TextField, Typography } from "@mui/material"
import { FieldIconWith$, TextFieldWith$ } from "../../../Components/FieldsWithSchema"
import { useState } from "react"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faEuroSign } from "@fortawesome/free-solid-svg-icons"
import { createOption, updateOption } from "../../../api"
import { Option, Option$, OptionWithoutId, OptionWithoutId$ } from "@competition-manager/schemas"


type OptionPopupProps = {  
    isVisible: boolean
    onClose: (option?: Option) => void
    editOption?: Option
}

export const OptionPopup: React.FC<OptionPopupProps> = ({isVisible, onClose, editOption}) => {

    const [option, setOption] = useState<OptionWithoutId>(editOption ?? {
        name: '',
        description: '',
        price: 0,
    })

    const [isNameValid, setIsNameValid] = useState(true)
    const [isDescriptionValid, setIsDescriptionValid] = useState(true)
    const [isPriceValid, setIsPriceValid] = useState(true)

    const isFormValid = isNameValid && isDescriptionValid && isPriceValid

    const handleSubmit = () => {
        if (editOption) {
            updateOption(editOption.id, OptionWithoutId$.parse(option)).then((option) => {
                onClose(Option$.parse(option))
            }).catch((e) => {
                console.log(e)
            })
            return;
        } 

        createOption(OptionWithoutId$.parse(option)).then((option) => {
            onClose(Option$.parse(option))
        }).catch((e) => {
            console.log(e)
        })
    }

    return (
        <Dialog open={isVisible} onClose={() => onClose()} maxWidth="sm" fullWidth>
            <Typography variant="h4" sx={{ padding: '1rem 0', textAlign: 'center' }}>
                {editOption ? 'Edit Option' : 'Create Option'}
            </Typography>
            <Box 
                component="form"
                sx={{ 
                    display: 'flex', 
                    flexDirection: 'column', 
                    gap: '1rem', 
                    padding: '1rem'
                }}
                onSubmit={(e) => {
                    e.preventDefault();
                    handleSubmit();
                }}
            >
                <Box 
                    sx={{ 
                        display: 'flex', 
                        gap: '1rem',
                        '& :last-child': { 
                            flexGrow: 1
                        }
                    }}
                >
                    {editOption && 
                        <FormControl>
                            <TextField
                                label="Id"
                                value={editOption.id}
                                disabled
                                sx={{ maxWidth: '100px' }}
                            />
                        </FormControl>
                    }

                    <TextFieldWith$ 
                        id="name" 
                        label={{ value: 'Name' }}
                        value={{ value: option.name, onChange: (value) => setOption({ ...option, name: value }) }}
                        validator={{ Schema$: Option$.shape.name, isValid: isNameValid, setIsValid: setIsNameValid }}
                        required
                    />
                </Box>

                <TextFieldWith$ 
                    id="description" 
                    label={{ value: 'Description' }}
                    value={{ value: option.description, onChange: (value) => setOption({ ...option, description: value }) }}
                    validator={{ Schema$: Option$.shape.description, isValid: isDescriptionValid, setIsValid: setIsDescriptionValid }}
                    multiline
                />

                <FieldIconWith$
                    id="price"
                    type="number"
                    label={{ value: 'Price' }}
                    value={{ value: option.price, onChange: (value) => setOption({ ...option, price: value }) }}
                    validator={{ Schema$: Option$.shape.price, isValid: isPriceValid, setIsValid: setIsPriceValid }}
                    required icon={<FontAwesomeIcon icon={faEuroSign} />}      
                    sx={{ maxWidth: '100px' }}    
                />

                <Button
                    type="submit"
                    variant="contained"
                    color="primary"
                    disabled={!isFormValid}
                >
                    {editOption ? 'Edit' : 'Create'}
                </Button>
            </Box>

        </Dialog>
    )
}

    
