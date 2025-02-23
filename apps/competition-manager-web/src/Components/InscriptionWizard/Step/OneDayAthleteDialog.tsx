/**
 * File: apps/competition-manager-web/src/Components/InscriptionWizard/Step/OneDayAthleteDialog.tsx
 * 
 * This component handles the dialog for creating one-day athletes.
 * It provides different forms based on the athlete type (FOREIGN, BPM, ALL).
 */

import { Dialog, DialogTitle, DialogContent, DialogActions, Button, Stack, TextField, MenuItem, Alert, Box } from "@mui/material"
import { OneDayPermission, Gender, AbbrBaseCategory } from "@competition-manager/schemas"
import { useTranslation } from "react-i18next"
import { useForm, Controller, Control } from "react-hook-form"
import { MobileDatePicker } from "@mui/x-date-pickers"
import { ReactNode, useState } from "react"
import { CloseButton } from "../../CloseButton"
import { useDeviceSize } from "../../../hooks"
import { getCategoryAbbr } from "@competition-manager/utils"

// Common European countries for athletics competitions
const COUNTRIES = [
    'FRA', 'GER', 'NLD', 'LUX', 'GBR', 'ESP', 'ITA', 'CHE'
] as const;

// BPM categories
const BPM_CATEGORIES = [AbbrBaseCategory.BEN, AbbrBaseCategory.PUP, AbbrBaseCategory.MIN];

export type FormData = {
    firstName: string;
    lastName: string;
    birthdate: Date | null;
    gender: Gender | undefined;
    license?: string;
    club?: string;
    country?: string;
}

type FormFieldProps = {
    name: keyof FormData;
    control: Control<FormData>;
    rules: Record<string, unknown>;
    label: string;
    children?: ReactNode;
}

const FormField = ({ name, control, rules, label, children, ...props }: FormFieldProps) => {
    const { t } = useTranslation();
    return (
        <Controller
            name={name}
            control={control}
            rules={rules}
            render={({ field, fieldState: { error } }) => (
                <TextField
                    {...field}
                    {...props}
                    label={label}
                    error={!!error}
                    helperText={error?.message && t(`validation:${error.message}`)}
                    fullWidth
                    select={!!children}
                >
                    {children}
                </TextField>
            )}
        />
    );
};

type OneDayAthleteDialogProps = {
    open: boolean;
    onClose: () => void;
    permission: OneDayPermission | null;
    onSubmit: (data: FormData) => void;
    referenceDate: Date;
    isSubmitting: boolean;
}

export const OneDayAthleteDialog: React.FC<OneDayAthleteDialogProps> = ({
    open,
    onClose,
    permission,
    onSubmit,
    referenceDate,
    isSubmitting
}) => {
    const { t } = useTranslation();
    const { isMobile } = useDeviceSize();
    const [showBpmError, setShowBpmError] = useState(false);

    const { control, handleSubmit, formState: { errors, isValid, isDirty }, watch } = useForm<FormData>({
        defaultValues: {
            firstName: '',
            lastName: '',
            birthdate: null,
            gender: undefined,
            license: '',
            club: '',
            country: ''
        },
        mode: 'onChange' // Enable real-time validation
    });

    // Watch birthdate and gender to validate BPM category
    const gender = watch('gender');

    // Validate BPM category
    const validateBPMCategory = (date: Date | null) => {
        if (!date) return true;
        // Use current gender if available, otherwise use M as default for category check
        const categoryGender = gender || Gender.M;
        const category = getCategoryAbbr(date, categoryGender, referenceDate).split(' ')[0];
        return BPM_CATEGORIES.includes(category as AbbrBaseCategory) || 'InvalidBPMCategory';
    };

    // Handle birthdate blur for BPM validation
    const handleBirthdateBlur = (date: Date | null) => {
        if (permission === OneDayPermission.BPM && date) {
            const isValid = validateBPMCategory(date);
            setShowBpmError(isValid !== true);
        }
    };

    // Check if form is complete based on permission type
    const isFormComplete = () => {
        const values = watch();
        const hasRequiredFields = values.firstName && values.lastName && values.birthdate && values.gender;
        
        if (permission === OneDayPermission.FOREIGN) {
            return hasRequiredFields && values.country && values.license && values.club && !showBpmError;
        }
        
        return hasRequiredFields && !showBpmError;
    };

    if (!permission) return null;

    return (
        <Dialog 
            open={open} 
            onClose={onClose} 
            maxWidth="sm" 
            fullWidth
            PaperProps={{
                sx: {
                    margin: isMobile ? 2 : 3,
                    width: 'calc(100% - 32px)',
                    maxHeight: 'calc(100% - 32px)',
                    position: 'relative'
                }
            }}
        >
            <CloseButton onClose={onClose} />
            <Box component="form" onSubmit={handleSubmit(onSubmit)}>
                <DialogTitle sx={{ pr: 6 }}>{t(`competition:oneDayAthlete.${permission.toLowerCase()}.title`)}</DialogTitle>
                <DialogContent>
                    <Alert severity="info" sx={{ mb: 3, mt: 1 }}>
                        {t(`competition:oneDayAthlete.${permission.toLowerCase()}.description`)}
                    </Alert>
                    <Stack spacing={3}>
                        <Stack 
                            direction={isMobile ? "column" : "row"} 
                            spacing={2}
                        >
                            <FormField
                                name="firstName"
                                control={control}
                                rules={{ required: 'FirstNameRequired', maxLength: 50 }}
                                label={t('labels:firstName')}
                            />
                            <FormField
                                name="lastName"
                                control={control}
                                rules={{ required: 'LastNameRequired', maxLength: 50 }}
                                label={t('labels:lastName')}
                            />
                        </Stack>
                        <Stack 
                            direction={isMobile ? "column" : "row"} 
                            spacing={2}
                        >
                            <Controller
                                name="birthdate"
                                control={control}
                                rules={{ 
                                    required: 'BirthdateRequired',
                                    validate: permission === OneDayPermission.BPM ? validateBPMCategory : undefined
                                }}
                                render={({ field }) => (
                                    <MobileDatePicker
                                        {...field}
                                        label={t('labels:birthdate')}
                                        format="dd/MM/yyyy"
                                        onAccept={(date) => {
                                            field.onChange(date);
                                            handleBirthdateBlur(date);
                                        }}
                                        disableFuture
                                        slotProps={{
                                            textField: {
                                                fullWidth: true,
                                                error: !!errors.birthdate || showBpmError,
                                                helperText: (errors.birthdate?.message && t(`validation:${errors.birthdate.message}`)) ||
                                                    (showBpmError && t('validation:InvalidBPMCategory'))
                                            }
                                        }}
                                    />
                                )}
                            />
                            <FormField
                                name="gender"
                                control={control}
                                rules={{ required: 'GenderRequired' }}
                                label={t('labels:gender')}
                            >
                                <MenuItem value={Gender.M}>{t('labels:male')}</MenuItem>
                                <MenuItem value={Gender.F}>{t('labels:female')}</MenuItem>
                            </FormField>
                        </Stack>
                        {permission === OneDayPermission.FOREIGN && (
                            <>
                                <FormField
                                    name="country"
                                    control={control}
                                    rules={{ required: 'CountryRequired' }}
                                    label={t('labels:country')}
                                >
                                    {COUNTRIES.map(country => (
                                        <MenuItem key={country} value={country}>
                                            {t(`countries:${country}`)}
                                        </MenuItem>
                                    ))}
                                </FormField>
                                <Alert 
                                    severity="info" 
                                    sx={{ 
                                        mt: 1,
                                        '& .MuiAlert-message': {
                                            width: '100%'
                                        }
                                    }}
                                >
                                    {t('competition:oneDayAthlete.countryNotListed')}
                                </Alert>
                                <Stack 
                                    direction={isMobile ? "column" : "row"} 
                                    spacing={2}
                                >
                                    <FormField
                                        name="license"
                                        control={control}
                                        rules={{ required: 'LicenseRequired' }}
                                        label={t('labels:license')}
                                    />
                                    <FormField
                                        name="club"
                                        control={control}
                                        rules={{ required: 'ClubRequired' }}
                                        label={t('labels:club')}
                                    />
                                </Stack>
                            </>
                        )}
                    </Stack>
                </DialogContent>
                <DialogActions sx={{ p: isMobile ? 2 : 3 }}>
                    <Button 
                        onClick={onClose}
                        disabled={isSubmitting}
                    >
                        {t('buttons:cancel')}
                    </Button>
                    <Button 
                        type="submit" 
                        variant="contained" 
                        disabled={!isValid || !isDirty || !isFormComplete() || showBpmError || isSubmitting}
                    >
                        {isSubmitting ? t('buttons:saving') : t('buttons:save')}
                    </Button>
                </DialogActions>
            </Box>
        </Dialog>
    );
}; 