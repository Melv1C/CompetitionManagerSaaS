//
// COEFFICIENTS IAAF (TABLE HONGROISE) MODEL 2017
// (Cyril Gavoille - voir iaaf.awk)
//
//
// Ã©preuves interclubs LOGICA

var IAAF: { [key: string]: number[] } = {};

IAAF["100m-F"]              = [   992,   6,   -2200,       0]; // (1)
IAAF["100m-M"]              = [  2463,   6,   -1700,       0]; // OK
IAAF["200m-F"]              = [  2242,   7,   -4550,       0]; // OK
IAAF["200m-M"]              = [   508,   6,   -3550,       0]; // OK
IAAF["400m-F"]              = [   335,   7,  -11000,       0]; // (1)
IAAF["400m-M"]              = [  1021,   7,   -7900,       0]; // OK
IAAF["800m-F"]              = [   688,   8,  -25000,       0]; // OK
IAAF["800m-M"]              = [   198,   7,  -18200,       0]; // OK
IAAF["1500m-F"]             = [   134,   8,  -54000,       0]; // OK
IAAF["1500m-M"]             = [  4066,   9,  -38500,       0]; // OK
IAAF["3000m-F"]             = [  2539,  10, -120000,       0]; // OK
IAAF["3000m-M"]             = [   815,   9,  -84000,       0]; // OK
//
IAAF["100mh-F"]             = [   398,   6,   -3000,       0]; // OK
IAAF["110mh-M"]             = [   766,   6,   -2580,       0]; // (1)
IAAF["400mh-F"]             = [208567,  10,  -13000,       0]; // OK
IAAF["400mh-M"]             = [   546,   7,   -9550,       0]; // (1)
//
IAAF["4x100m-F"]            = [  3895,   8,   -9800,       0]; // OK
IAAF["4x100m-M"]            = [  1236,   7,   -6950,       0]; // OK
IAAF["4x400m-F"]            = [  1562,   9,  -48000,       0]; // OK
IAAF["4x400m-M"]            = [  5026,   9,  -33400,       0]; // OK
//
IAAF["3000mst-M"]           = [  4316,  10, -102000,       0]; // OK
IAAF["3000mm-F"]            = [   881,   6,   -1871,       0]; // OK
IAAF["5000mm-M"]            = [   436,   6,   -2760,       0]; // OK
//
IAAF["hauteur-F"]           = [  3934,   6,    1057.4, -5000]; // OK
IAAF["hauteur-M"]           = [  3229,   6,    1153.4, -5000]; // OK
IAAF["longueur-F"]          = [  1966,   7,    4924,   -5000]; // OK
IAAF["longueur-M"]          = [  1929,   7,    4841,   -5000]; // OK
IAAF["perche-F"]            = [  3953,   7,    3483,   -5000]; // OK
IAAF["perche-M"]            = [  3042,   7,    3939,   -5000]; // OK
IAAF["triple-F"]            = [  4282,   8,   10553,   -5000]; // OK
IAAF["triple-M"]            = [  4611,   8,    9863,   -5000]; // OK
//
IAAF["disque-F"]            = [ 40277,  11,  222730,  -20000]; // OK
IAAF["disque-M"]            = [  4007,  10,  223260,  -20000]; // OK
IAAF["javelot-F"]           = [  4073,  10,  221490,  -20000]; // OK
IAAF["javelot-M"]           = [ 23974,  11,  288680,  -20000]; // OK
IAAF["marteau-F"]           = [ 30965,  11,  254000,  -20000]; // OK
IAAF["marteau-M"]           = [ 28038,  11,  266940,  -20000]; // OK
IAAF["poids-F"]             = [   462,   8,   65753,  -20000]; // OK
IAAF["poids-M"]             = [ 42172,  10,   68770,  -20000]; // OK
//
// autres Ã©preuves LOGICA (outdoor)
IAAF["10000m-F"]            = [  1712,  11, -450000,       0]; // (1)
IAAF["10000m-M"]            = [   524,  10, -315000,       0]; // (3)
IAAF["1000m-F"]             = [   382,   8,  -33000,       0]; // OK
IAAF["1000m-M"]             = [  1074,   8,  -24000,       0]; // OK
IAAF["10kmm-F"]             = [   779,   7,   -6437,       0]; // OK
IAAF["10kmm-M"]             = [  1118,   7,   -5580,       0]; // OK
IAAF["2000m-F"]             = [  6766,  10,  -75000,       0]; // OK
IAAF["2000m-M"]             = [  2181,   9,  -52800,       0]; // OK
IAAF["2000mst-F"]           = [    45,   8,  -88000,       0]; // OK
IAAF["2000mst-M"]           = [  1023,   9,  -66000,       0]; // OK
IAAF["20kmm-F"]             = [   187,   7,  -13200,       0]; // OK
IAAF["20kmm-M"]             = [  2735,   8,  -11400,       0]; // OK
IAAF["3000mst-F"]           = [  1323,  10, -151000,       0]; // OK
IAAF["300m-F"]              = [     7,   5,   -7700,       0]; // (3)
IAAF["300m-M"]              = [   183,   6,   -5720,       0]; // OK
IAAF["3000mm-M"]            = [  1209,   6,   -1650,       0]; // OK
IAAF["4x200m-F"]            = [   795,   8,  -21200,       0]; // (2)
IAAF["4x200m-M"]            = [ 29767,   9,  -14400,       0]; // OK
IAAF["5000m-F"]             = [   808,  10, -210000,       0]; // OK
IAAF["5000m-M"]             = [  2778,  10, -144000,       0]; // OK
IAAF["5000mm-F"]            = [  3246,   7,   -3140,       0]; // OK
IAAF["mile-F"]              = [  1165,   9,  -58000,       0]; // OK
IAAF["mile-M"]              = [   351,   8,  -41500,       0]; // OK
//
IAAF["10000mm-F"]           = IAAF["10kmm-F"];
IAAF["10000mm-M"]           = IAAF["10kmm-M"];
//
// Ã©preuve LOGICA (indoor)
IAAF["50m-F-i"]             = [  3303,   6,   -1210,       0]; // OK
IAAF["50m-M-i"]             = [   958,   5,    -920,       0]; // OK
IAAF["60m-F-i"]             = [   249,   5,   -1400,       0]; // OK
IAAF["60m-M-i"]             = [   686,   5,   -1070,       0]; // OK
IAAF["50mh-F-i"]            = [   162,   5,   -1530,       0]; // (1)
IAAF["50mh-M-i"]            = [   342,   5,   -1235,       0]; // (1)
IAAF["60mh-F-i"]            = [  1116,   6,   -1820,       0]; // (1)
IAAF["60mh-M-i"]            = [   239,   5,   -1460,       0]; // OK
IAAF["200m-F-i"]            = [  1962,   7,   -4750,       0]; // OK
IAAF["200m-M-i"]            = [   504,   6,   -3600,       0]; // OK
IAAF["300m-F-i"]            = [  6595,   8,   -7900,       0]; // OK
IAAF["300m-M-i"]            = [  1803,   7,   -5800,       0]; // OK
IAAF["400m-F-i"]            = [  3224,   8,  -11200,       0]; // (1)
IAAF["400m-M-i"]            = [   981,   7,   -8060,       0]; // OK
IAAF["800m-F-i"]            = [   572,   8,  -26400,       0]; // OK
IAAF["800m-M-i"]            = [  1974,   8,  -18400,       0]; // OK
IAAF["1000m-F-i"]           = [  3473,   9,  -34040,       0]; // OK
IAAF["1000m-M-i"]           = [  1139,   8,  -24000,       0]; // OK
IAAF["1500m-F-i"]           = [  1365,   9,  -54000,       0]; // OK
IAAF["1500m-M-i"]           = [    42,   7,  -38600,       0]; // OK
IAAF["mile-F-i"]            = [  1154,   9,  -58550,       0]; // OK
IAAF["mile-M-i"]            = [   369,   8,  -41500,       0]; // OK
IAAF["2000m-F-i"]           = [   685,   9,  -75220,       0]; // OK
IAAF["2000m-M-i"]           = [   226,   8,  -52800,       0]; // OK
IAAF["3000m-F-i"]           = [   259,   9, -120000,       0]; // OK
IAAF["3000m-M-i"]           = [  8322,  10,  -84000,       0]; // OK
IAAF["5000m-F-i"]           = [   825,  10, -210000,       0]; // (5)
IAAF["5000m-M-i"]           = [    29,   8, -144000,       0]; // (4)
IAAF["4x200m-F-i"]          = [   826,   8,  -21200,       0]; // OK
IAAF["4x200m-M-i"]          = [   312,   7,  -14400,       0]; // OK
IAAF["4x400m-F-i"]          = [   155,   8,  -48400,       0]; // OK
IAAF["4x400m-M-i"]          = [   489,   8,  -34000,       0]; // OK
//
IAAF["hauteur-F-i"]         = IAAF["hauteur-F"];
IAAF["hauteur-M-i"]         = IAAF["hauteur-M"];
IAAF["longueur-F-i"]        = IAAF["longueur-F"];
IAAF["longueur-M-i"]        = IAAF["longueur-M"];
IAAF["perche-F-i"]          = IAAF["perche-F"];
IAAF["perche-M-i"]          = IAAF["perche-M"];
IAAF["triple-F-i"]          = IAAF["triple-F"];
IAAF["triple-M-i"]          = IAAF["triple-M"];
IAAF["poids-F-i"]           = IAAF["poids-F"];
IAAF["poids-M-i"]           = IAAF["poids-M"];
//
// Ã©preuves hors LOGICA
IAAF["1/2-marathon-F"]      = [   353,   7,   -9900,       0]; // OK
IAAF["1/2-marathon-M"]      = [   102,   6,   -7020,       0]; // OK
IAAF["marathon-F"]          = [   595,   8,  -22800,       0]; // OK
IAAF["marathon-M"]          = [   191,   7,  -15600,       0]; // OK
IAAF["100km-F"]             = [   874,   9,  -61200,       0]; // OK
IAAF["100km-M"]             = [  1765,   9,  -48600,       0]; // OK
IAAF["10km-F"]              = [  1742,   7,   -4500,       0]; // OK
IAAF["10km-M"]              = [ 52841,   8,   -3150,       0]; // OK
IAAF["10miles-F"]           = [    63,   6,   -7438,       0]; // OK
IAAF["10miles-M"]           = [  1852,   7,   -5250,       0]; // OK
IAAF["15km-F"]              = [   732,   7,   -6905,       0]; // OK
IAAF["15km-M"]              = [  2162,   7,   -4868,       0]; // OK
IAAF["20km-F"]              = [   396,   7,   -9357,       0]; // OK
IAAF["20km-M"]              = [  1147,   7,   -6629,       0]; // OK
IAAF["25km-F"]              = [   228,   7,  -12144,       0]; // OK
IAAF["25km-M"]              = [  6765,   8,   -8536,       0]; // OK
IAAF["2miles-F"]            = [  2157,  10, -129630,       0]; // OK
IAAF["2miles-M"]            = [   703,   9,  -90480,       0]; // OK
IAAF["2miles-F-i"]          = [  2202,  10, -129630,       0]; // OK
IAAF["2miles-M-i"]          = [   721,   9,  -90700,       0]; // OK
IAAF["30km-F"]              = [  1426,   8,  -15123,       0]; // OK
IAAF["30km-M"]              = [  4353,   8,  -10531,       0]; // OK
IAAF["30kmm-F"]             = [    69,   7,  -21545,       0]; // OK
IAAF["30kmm-M"]             = [   893,   8,  -19110,       0]; // OK
IAAF["35kmm-M"]             = [   576,   8,  -23400,       0]; // OK
IAAF["500m-F-i"]            = [  1714,   8,  -15050,       0]; // OK
IAAF["500m-M-i"]            = [   565,   7,  -10600,       0]; // (1)
IAAF["50kmm-F"]             = [   196,   8,  -39952,       0]; // OK
IAAF["50kmm-M"]             = [  2124,   9,  -37200,       0]; // OK
IAAF["55m-F-i"]             = [  2768,   6,   -1315,       0]; // (2)
IAAF["55m-M-i"]             = [   789,   5,   -1000,       0]; // OK
IAAF["55mh-F-i"]            = [  1319,   6,   -1680,       0]; // OK
IAAF["55mh-M-i"]            = [  3007,   6,   -1335,       0]; // OK
IAAF["600m-F"]              = [  1192,   8,  -18400,       0]; // OK
IAAF["600m-M"]              = [   367,   7,  -13100,       0]; // OK
IAAF["heptathlon-F"]        = [  1581,   9,   55990,   -5000]; // OK
IAAF["pentathlon-F-i"]      = [ 29445,  10,   41033,   -5000]; // OK
IAAF["decathlon-M"]         = [  9774,  10,   71173,   -5000]; // OK
IAAF["heptathlon-M-i"]      = [  1752,   9,   53175,   -5000]; // OK
//
// Ã©preuves spÃ©cifiques LOGICA
IAAF["1500mst-M"]           = [   209,   8,  -47200,       0]; // non vÃ©rifiÃ©
IAAF["2000mm-F"]            = [  1558,   7,   -1385,       0]; // non vÃ©rifiÃ©
IAAF["320mh-F"]             = [   257,   7,  -11200,       0]; // non vÃ©rifiÃ©
IAAF["80mh-F"]              = [   239,   6,   -2840,       0]; // non vÃ©rifiÃ©
IAAF["400mh-M-i"]           = [   205,   7,  -12000,       0]; // non vÃ©rifiÃ©
//
IAAF["50mh-F"]              = IAAF["50mh-F-i"];
IAAF["50mh-M"]              = IAAF["50mh-M-i"];
IAAF["60mh-F"]              = IAAF["60mh-F-i"];
IAAF["60mh-M"]              = IAAF["60mh-M-i"];
IAAF["3000mm-F-i"]          = IAAF["3000mm-F"];
IAAF["3000mm-M-i"]          = IAAF["3000mm-M"];
IAAF["5000mm-M-i"]          = IAAF["5000mm-M"];
IAAF["5000mm-F-i"]          = IAAF["5000mm-F"];

export default IAAF;
