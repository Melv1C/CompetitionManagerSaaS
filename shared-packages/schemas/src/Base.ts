import { z } from "zod";

export const Id$ = z.coerce.number().positive('IdMustBePositive');
export type Id = z.infer<typeof Id$>;

export const Eid$ = z.string();
export type Eid = z.infer<typeof Eid$>;

export const Name$ = z.string().min(3, "NameTooShort3").max(255, "NameTooLong255");
export type Name = z.infer<typeof Name$>;

export const Abbr$ = z.string().min(1, "AbbrTooShort1").max(10, "AbbrTooLong10");
export type Abbr = z.infer<typeof Abbr$>;

export const Date$ = z.coerce.date().min(new Date('1900-01-01'), "DateTooEarly");
export type Date = z.infer<typeof Date$>;

export const Price$ = z.coerce.number().nonnegative('PriceMustBeNonNegative');
export type Price = z.infer<typeof Price$>;

export const License$ = z.string().min(1, "LicenseTooShort1").max(20, "LicenseTooLong20");
export type License = z.infer<typeof License$>;

export const Bib$ = z.coerce.number().positive('BibMustBePositive');
export type Bib = z.infer<typeof Bib$>;

export const Email$ = z.string().email('InvalidEmail');
export type Email = z.infer<typeof Email$>;

export const Place$ = z.coerce.number().int('PlaceMustBeInteger').positive('PlaceMustBePositive').lte(100, 'PlaceTooHigh');
export type Place = z.infer<typeof Place$>;