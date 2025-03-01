import {
    CreateOption,
    CreatePaymentPlan,
    Id,
    Option,
    Option$,
    PaymentPlan,
    PaymentPlan$,
    UpdateOption,
    UpdatePaymentPlan,
} from '@competition-manager/schemas';
import { api } from '../utils/api';

export const getPlans = async (): Promise<PaymentPlan[]> => {
    const { data } = await api.get('/offers/plans');
    return PaymentPlan$.array().parse(data);
};

export const createPlan = async (
    plan: CreatePaymentPlan
): Promise<PaymentPlan> => {
    const { data } = await api.post('/offers/plans', plan);
    return PaymentPlan$.parse(data);
};

export const updatePlan = async (
    id: Id,
    plan: UpdatePaymentPlan
): Promise<PaymentPlan> => {
    const { data } = await api.put(`/offers/plans/${id}`, plan);
    return PaymentPlan$.parse(data);
};

export const deletePlan = async (id: Id): Promise<void> => {
    await api.delete(`/offers/plans/${id}`);
};

export const getOptions = async (): Promise<Option[]> => {
    const { data } = await api.get('/offers/options');
    return Option$.array().parse(data);
};

export const createOption = async (option: CreateOption): Promise<Option> => {
    const { data } = await api.post('/offers/options', option);
    return Option$.parse(data);
};

export const updateOption = async (
    id: Id,
    option: UpdateOption
): Promise<Option> => {
    const { data } = await api.put(`/offers/options/${id}`, option);
    return Option$.parse(data);
};

export const deleteOption = async (id: Id): Promise<void> => {
    await api.delete(`/offers/options/${id}`);
};
