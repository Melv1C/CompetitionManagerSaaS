import { Athlete, Competition, Inscription, TokenData } from '@competition-manager/schemas';
import { atom } from 'jotai';

export const userTokenAtom = atom<TokenData | 'NOT_LOGGED' | null>(null);

export const competitionAtom = atom<Competition | null>(null);
export const inscriptionsAtom = atom<Inscription[] | null>(null);

type InscriptionData = {
    athlete?: Athlete;
};

export const inscriptionDataAtom = atom<InscriptionData>({});