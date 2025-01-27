import { CreateInscription } from "@competition-manager/schemas";
import { api } from "../../utils/api";

export const createInscriptions = async (eid: string, inscriptions: CreateInscription[], isAdmin: boolean = false) => {
    const { data } = await api.post(`/competitions/${eid}/inscriptions`, inscriptions, { params: { isAdmin } });
    // TODO: Parse response ?? Url or Created object
    return data;
}