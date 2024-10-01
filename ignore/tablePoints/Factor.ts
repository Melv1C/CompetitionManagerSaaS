//
// COEFFICIENTS IAAF Ã‰PREUVES COMBINÃ‰ES MODEL 2001
// (Cyril Gavoille)
//
//  HOMME
//

var MEN_FACTOR: { [key: string]: { a: number, b: number, c: number } } = {};
var WOMEN_FACTOR: { [key: string]: { a: number, b: number, c: number } } = {};

MEN_FACTOR["60m"] = { a: 58.015, b: 11.5, c: 1.81 };
MEN_FACTOR["100m"] = { a: 25.4347, b: 18, c: 1.81 };
MEN_FACTOR["200m"] = { a: 5.8425, b: 38, c: 1.81 };
MEN_FACTOR["400m"] = { a: 1.53775, b: 82, c: 1.81 };
MEN_FACTOR["1000m"] = { a: 0.08713, b: 305.5, c: 1.85 };
MEN_FACTOR["1500m"] = { a: 0.03768, b: 480, c: 1.85 };
MEN_FACTOR["60mH"] = { a: 20.5173, b: 15.5, c: 1.92 };
MEN_FACTOR["110mH"] = { a: 5.74352, b: 28.5, c: 1.92 };
MEN_FACTOR["HJ"] = { a: 0.8465, b: 75, c: 1.42 };
MEN_FACTOR["PV"] = { a: 0.2797, b: 100, c: 1.35 };
MEN_FACTOR["LJ"] = { a: 0.14354, b: 220, c: 1.40 };
MEN_FACTOR["SP"] = { a: 51.39, b: 1.5, c: 1.05 };
MEN_FACTOR["DT"] = { a: 12.91, b: 4, c: 1.10 };
MEN_FACTOR["HT"] = { a: 13.0941, b: 5.5, c: 1.05 };
MEN_FACTOR["JT"] = { a: 10.14, b: 7, c: 1.08 };

WOMEN_FACTOR["60m"] = { a: 46.0849, b: 13, c: 1.81 };
WOMEN_FACTOR["100m"] = { a: 17.857, b: 21, c: 1.81 };
WOMEN_FACTOR["200m"] = { a: 4.99087, b: 42.5, c: 1.81 };
WOMEN_FACTOR["400m"] = { a: 1.34285, b: 91.7, c: 1.81 };
WOMEN_FACTOR["800m"] = { a: 0.11193, b: 254, c: 1.88 };
WOMEN_FACTOR["60mH"] = { a: 20.0479, b: 17, c: 1.835 };
WOMEN_FACTOR["100mH"] = { a: 9.23076, b: 26.7, c: 1.835 };
WOMEN_FACTOR["HJ"] = { a: 1.84523, b: 75, c: 1.348 };
WOMEN_FACTOR["PV"] = { a: 0.44125, b: 100, c: 1.35 };
WOMEN_FACTOR["LJ"] = { a: 0.188807, b: 210, c: 1.41 };
WOMEN_FACTOR["SP"] = { a: 56.0211, b: 1.5, c: 1.05 };
WOMEN_FACTOR["DT"] = { a: 12.3311, b: 3, c: 1.10 };
WOMEN_FACTOR["HT"] = { a: 13.3174, b: 5, c: 1.05 };
WOMEN_FACTOR["JT"] = { a: 15.9803, b: 3.8, c: 1.04 };

export {MEN_FACTOR, WOMEN_FACTOR};
