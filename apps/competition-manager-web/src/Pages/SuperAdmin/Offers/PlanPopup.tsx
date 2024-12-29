import { Box, Button, Chip, Dialog, FormControl, MenuItem, Select, TextField, Typography } from "@mui/material"
import { CreatePaymentPlan$, Option, PaymentPlan, PaymentPlan$, UpdatePaymentPlan, UpdatePaymentPlan$ } from "@competition-manager/schemas"
import { FieldIconWith$, TextFieldWith$ } from "../../../Components/FieldsWithSchema"
import { useState } from "react"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faEuroSign } from "@fortawesome/free-solid-svg-icons"
import { createPlan, updatePlan } from "../../../api"


type PlanPopupProps = {  
    isVisible: boolean
    onClose: (plan?: PaymentPlan) => void
    options: Option[]
    editPlan?: PaymentPlan
}

export const PlanPopup: React.FC<PlanPopupProps> = ({isVisible, onClose, options, editPlan}) => {

    const [plan, setPlan] = useState<UpdatePaymentPlan>(editPlan ? 
        {
            name: editPlan.name,
            description: editPlan.description,
            price: editPlan.price,
            includedOptionsIds: editPlan.includedOptions.map(option => option.id)
        } : {
            name: '',
            description: '',
            price: 0,
            includedOptionsIds: []
        }
    )

    const [isNameValid, setIsNameValid] = useState(true)
    const [isDescriptionValid, setIsDescriptionValid] = useState(true)
    const [isPriceValid, setIsPriceValid] = useState(true)

    const isFormValid = isNameValid && isDescriptionValid && isPriceValid

    const handleSubmit = () => {
        if (editPlan) {
            updatePlan(editPlan.id, UpdatePaymentPlan$.parse(plan)).then((plan) => {
                onClose(PaymentPlan$.parse(plan))
            }).catch((e) => {
                console.log(e)
            })
            return;
        } 

        createPlan(CreatePaymentPlan$.parse(plan)).then((plan) => {
            onClose(PaymentPlan$.parse(plan))
        }).catch((e) => {
            console.log(e)
        })
    }

    return (
        <Dialog open={isVisible} onClose={() => onClose()} maxWidth="sm" fullWidth>
            <Typography variant="h4" sx={{ padding: '1rem 0', textAlign: 'center' }}>
                {editPlan ? 'Edit Plan' : 'Create Plan'}
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
                    {editPlan && 
                        <FormControl>
                            <TextField
                                label="Id"
                                value={editPlan.id}
                                disabled
                                sx={{ maxWidth: '100px' }}
                            />
                        </FormControl>
                    }

                    <TextFieldWith$ 
                        id="name" 
                        label={{ value: 'Name' }}
                        value={{ value: plan.name, onChange: (value) => setPlan({ ...plan, name: value }) }}
                        validator={{ Schema$: CreatePaymentPlan$.shape.name, isValid: isNameValid, setIsValid: setIsNameValid }}
                        required
                    />
                </Box>

                <TextFieldWith$ 
                    id="description" 
                    label={{ value: 'Description' }}
                    value={{ value: plan.description, onChange: (value) => setPlan({ ...plan, description: value }) }}
                    validator={{ Schema$: CreatePaymentPlan$.shape.description, isValid: isDescriptionValid, setIsValid: setIsDescriptionValid }}
                    multiline
                />

                <FieldIconWith$
                    id="price"
                    type="number"
                    label={{ value: 'Price' }}
                    value={{ value: plan.price, onChange: (value) => setPlan({ ...plan, price: value }) }}
                    validator={{ Schema$: CreatePaymentPlan$.shape.price, isValid: isPriceValid, setIsValid: setIsPriceValid }}
                    required icon={<FontAwesomeIcon icon={faEuroSign} />}      
                    sx={{ maxWidth: '100px' }}    
                />

                {editPlan &&
                    <FormControl>
                        <Select
                            id="includedOptions"
                            multiple
                            value={plan.includedOptionsIds}
                            onChange={(e) => setPlan({ ...plan, includedOptionsIds: e.target.value as number[] })}
                            renderValue={(selected) => (
                                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
                                    {selected.map((value) => (
                                        <Chip key={value} label={options.find(option => option.id === value)?.name} />
                                    ))}
                                </Box>
                            )}
                        >
                            {options.map((option) => (
                                <MenuItem key={option.id} value={option.id}>
                                    {option.name}
                                </MenuItem>
                            ))}
                        </Select>
                    </FormControl>
                }

                <Button
                    type="submit"
                    variant="contained"
                    color="primary"
                    disabled={!isFormValid}
                >
                    {editPlan ? 'Edit' : 'Create'}
                </Button>
            </Box>

        </Dialog>
    )
}

    
