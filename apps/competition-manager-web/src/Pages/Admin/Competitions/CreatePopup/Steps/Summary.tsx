import { createCompetition } from '@/api';
import { StepperButtons as Buttons } from '@/Components';
import {
    CreateCompetition$,
    Option,
    PaymentPlan,
} from '@competition-manager/schemas';
import { Box } from '@mui/material';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { StepProps } from '..';

type SummaryProps = Omit<StepProps, 'handleNext'> & {
    dataForm: {
        plan: PaymentPlan;
        selectedOptions: Option[];
        name: string;
        date: Date;
        closeDate?: Date;
    };
};

export const Summary: React.FC<SummaryProps> = ({ handleBack, dataForm }) => {
    const { t } = useTranslation();

    const baseCompetition = CreateCompetition$.parse({
        ...dataForm,
        paymentPlanId: dataForm.plan.id,
        optionsId: dataForm.selectedOptions.map((option) => option.id),
    });

    const navigate = useNavigate();

    const onSubmit = async () => {
        createCompetition(baseCompetition).then((competition) => {
            navigate(`/admin/competitions/${competition.eid}`);
        });
    };

    return (
        <Box>
            <Box
                sx={{
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '1rem',
                    justifyContent: 'center',
                }}
            >
                <Box>
                    <Box>
                        <Box>
                            {t('glossary:plan')}: {dataForm.plan.name}
                        </Box>
                        <Box>
                            {t('glossary:options')}:{' '}
                            {dataForm.selectedOptions
                                .map((option) => option.name)
                                .join(', ')}
                        </Box>
                    </Box>

                    <Box>
                        <Box>
                            {t('labels:name')}: {dataForm.name}
                        </Box>
                        <Box>
                            {t('labels:date')}:{' '}
                            {dataForm.date?.toLocaleDateString('fr')}
                        </Box>
                        {dataForm.closeDate && (
                            <Box>
                                {t('labels:end_date')}:{' '}
                                {dataForm.closeDate?.toLocaleDateString('fr')}
                            </Box>
                        )}
                    </Box>
                </Box>
            </Box>

            <Buttons
                buttons={[
                    {
                        label: t('buttons:previous'),
                        onClick: handleBack,
                        variant: 'outlined',
                    },
                    { label: t('buttons:pay'), onClick: onSubmit },
                ]}
            />
        </Box>
    );
};
