import { atom, useAtom } from 'jotai';

const userTokenAtom = atom<string | null>(null);

export const useUserToken = () => {
    return useAtom(userTokenAtom);
};