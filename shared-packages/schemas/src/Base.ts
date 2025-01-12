import { z } from 'zod';

export const Id$ = z.coerce.number().positive();
export type Id = z.infer<typeof Id$>;

export const Eid$ = z.string();
export type Eid = z.infer<typeof Eid$>;

export const Name$ = z.string().min(3, "Name must be at least 3 characters long").max(255, "Name must be at most 255 characters long");
export type Name = z.infer<typeof Name$>;

export const Abbr$ = z.string().min(1, "Abbreviation must be at least 1 character long").max(10, "Abbreviation must be at most 10 characters long");
export type Abbr = z.infer<typeof Abbr$>;

export const Date$ = z.coerce.date().min(new Date('1900-01-01'));
export type Date = z.infer<typeof Date$>;

export const Price$ = z.coerce.number().nonnegative();
export type Price = z.infer<typeof Price$>;

export const License$ = z.string().min(1, "License must be at least 1 character long").max(20, "License must be at most 20 characters long");
export type License = z.infer<typeof License$>;

export const Email$ = z.string().email();
export type Email = z.infer<typeof Email$>;