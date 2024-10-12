import { atom } from 'jotai';
import { Photo } from '../types/photo';

export const photosAtom = atom<Photo[]>([]);
export const pageAtom = atom(1);

