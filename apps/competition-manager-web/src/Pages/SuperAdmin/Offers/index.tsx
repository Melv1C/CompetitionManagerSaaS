
import { useState, useEffect } from 'react';
import { DataGrid, GridColDef } from '@mui/x-data-grid';
import { Box, Divider, IconButton, Typography } from '@mui/material';
import { MaxWidth } from '../../../Components/MaxWidth';
import { Add, Delete, Edit } from '../../../Components/Icons';
import { CircleButton } from '../../../Components/CircleButton';
import { Option, PaymentPlan } from '@competition-manager/schemas';
import { deleteOption, deletePlan, getOptions, getPlans } from '../../../api';
import { PlanPopup } from './PlanPopup';
import { OptionPopup } from './OptionPopup';


export const Offers = () => {
    const [plans, setPlans] = useState<PaymentPlan[]>([]);
    const [options, setOptions] = useState<Option[]>([]);

    const [isPlanPopupVisible, setIsPlanPopupVisible] = useState(false);
    const [editPlan, setEditPlan] = useState<PaymentPlan>();
    const [isOptionPopupVisible, setIsOptionPopupVisible] = useState(false);
    const [optionEdit, setOptionEdit] = useState<Option>();

    useEffect(() => {
        getPlans().then(data => setPlans(data));
        getOptions().then(data => setOptions(data));
    }, []);

    const planColumns: GridColDef[] = [
        { field: 'id', headerName: 'ID', width: 90 },
        { field: 'name', headerName: 'Name', width: 150 },
        { field: 'description', headerName: 'Description', width: 200 },
        { field: 'price', headerName: 'Price', width: 110 },
        { field: 'includedOptions', headerName: 'Included Options', width: 200, valueFormatter: (value: Option[]) => value.map(option => option.name).join(', ') },
        {
            field: 'actions',
            headerName: 'Actions',
            width: 150,
            renderCell: (params) => (
            <>
                <IconButton onClick={() => handleEditPlan(params.row.id)} color='primary'><Edit /></IconButton>
                <IconButton onClick={() => handleDeletePlan(params.row.id)} color='error'><Delete /></IconButton>
            </>
            ),
        },
    ];

    const optionColumns: GridColDef[] = [
        { field: 'id', headerName: 'ID', width: 90 },
        { field: 'name', headerName: 'Name', width: 150 },
        { field: 'description', headerName: 'Description', width: 200 },
        { field: 'price', headerName: 'Price', width: 110 },
        {
            field: 'actions',
            headerName: 'Actions',
            width: 150,
            renderCell: (params) => (
            <>
                <IconButton onClick={() => handleEditOption(params.row.id)} color='primary'><Edit /></IconButton>
                <IconButton onClick={() => handleDeleteOption(params.row.id)} color='error'><Delete /></IconButton>
            </>
            ),
        },
    ];

    const onPlanPopupClose = (plan?: PaymentPlan) => {
        setIsPlanPopupVisible(false);
        if (plan) {
            if (editPlan) {
                setPlans([...plans.filter(p => p.id !== plan.id), plan]);
            } else {
                setPlans([...plans, plan]);
            }
        }
    }

    const onOptionPopupClose = (option?: Option) => {
        setIsOptionPopupVisible(false);
        if (option) {
            if (optionEdit) {
                setOptions([...options.filter(o => o.id !== option.id), option]);
            } else {
                setOptions([...options, option]);
            }
        }
    }

    const handleCreatePlan = () => {
        setEditPlan(undefined);
        setIsPlanPopupVisible(true);
    };

    const handleEditPlan = (id: number) => {
        setEditPlan(plans.find(plan => plan.id === id));
        setIsPlanPopupVisible(true);
    };

    const handleDeletePlan = (id: number) => {
        deletePlan(id).then(() => setPlans(plans.filter(plan => plan.id !== id)));
    };

    const handleCreateOption = () => {
        setOptionEdit(undefined);
        setIsOptionPopupVisible(true);
    };

    const handleEditOption = (id: number) => {
        setOptionEdit(options.find(option => option.id === id));
        setIsOptionPopupVisible(true);
    };

    const handleDeleteOption = (id: number) => {
        deleteOption(id).then(() => setOptions(options.filter(option => option.id !== id)));
    };


    return (
        <MaxWidth>
            <Box 
                sx={{ 
                    display: 'flex', 
                    justifyContent: 'space-between', 
                    alignItems: 'center',
                    padding: '1rem 0'
                }}
            >
                <Typography variant="h4">Plans</Typography>
                <CircleButton onClick={handleCreatePlan} variant='contained' color='secondary'>
                    <Add size='xl' />
                </CircleButton>
            </Box>
            <Box sx={{ height: 400, width: '100%' }}>
                <DataGrid rows={plans} columns={planColumns} />
            </Box>

            {isPlanPopupVisible && <PlanPopup isVisible={isPlanPopupVisible} onClose={onPlanPopupClose} options={options} editPlan={editPlan} />}

            <Divider sx={{ margin: '2rem 0' }} />

            <Box 
                sx={{ 
                    display: 'flex', 
                    justifyContent: 'space-between', 
                    alignItems: 'center',
                    padding: '1rem 0'
                }}
            >
                <Typography variant="h4">Options</Typography>
                <CircleButton onClick={handleCreateOption} variant='contained' color='secondary'>
                    <Add size='xl' />
                </CircleButton>
            </Box>
            <Box sx={{ height: 400, width: '100%' }}>
                <DataGrid rows={options} columns={optionColumns} />
            </Box>

            {isOptionPopupVisible && <OptionPopup isVisible={isOptionPopupVisible} onClose={onOptionPopupClose} editOption={optionEdit} />}
        </MaxWidth>
    );
};