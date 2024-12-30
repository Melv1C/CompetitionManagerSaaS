import { Competition, TokenData } from '@competition-manager/schemas';
import { atom } from 'jotai';

export const userTokenAtom = atom<TokenData | 'NOT_LOGGED' | null>(null);

export const competitionAtom = atom<Competition | null>(null);