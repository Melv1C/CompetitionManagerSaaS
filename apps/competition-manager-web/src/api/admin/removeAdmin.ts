import { api } from '@/utils/api';
import { Eid, Id } from '@competition-manager/schemas';

export const removeAdmin = async (eid: Eid, adminId: Id) => {
    await api.delete(`/competitions/${eid}/admins/${adminId}`);
    return true;
};
