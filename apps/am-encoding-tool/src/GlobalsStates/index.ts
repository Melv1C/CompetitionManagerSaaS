import { Competition } from '@competition-manager/schemas';
import { atom } from 'jotai';

export const competitionAtom = atom<Competition | null>(null);