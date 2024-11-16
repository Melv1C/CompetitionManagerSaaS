import { TokenData } from '@competition-manager/schemas';
import { atom, useAtom } from 'jotai';

const userTokenAtom = atom<TokenData | 'NOT_LOGGED' | null>(null);

export const useUserToken = () => {
    return useAtom(userTokenAtom);
};