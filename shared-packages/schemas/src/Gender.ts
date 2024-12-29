import z from 'zod';

export enum Gender {
    M = 'M',
    F = 'F',
}
export const Gender$ = z.nativeEnum(Gender);