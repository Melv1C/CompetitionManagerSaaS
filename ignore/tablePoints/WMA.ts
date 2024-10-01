var W: { [key: string]: { 35: number, 40: number, 45: number, 50: number, 55: number, 60: number, 65: number, 70: number, 75: number, 80: number, 85: number, 90: number, 95: number, 100: number, 105: number, 110: number } } = {};
var M: { [key: string]: { 35: number, 40: number, 45: number, 50: number, 55: number, 60: number, 65: number, 70: number, 75: number, 80: number, 85: number, 90: number, 95: number, 100: number, 105: number, 110: number } } = {};

/*
WOMEN
Age 60m 100m 200m 400m 800m 1000m 1500m 60m
Hurdles
Short
Hurdles
35 1.0000 1.0000 1.0000 0.9783 0.9929 0.9995 0.9812 1.0000 0.9932
40 0.9985 0.9810 0.9787 0.9441 0.9563 0.9624 0.9441 0.9288 1.1368
45 0.9613 0.9441 0.9411 0.9084 0.9192 0.9248 0.9069 0.8980 1.0971
50 0.9259 0.9080 0.9040 0.8711 0.8814 0.8869 0.8697 0.8861 1.0597
55 0.8922 0.8726 0.8673 0.8324 0.8432 0.8485 0.8324 0.8530 1.0188
60 0.8603 0.8379 0.8309 0.7924 0.8044 0.8098 0.7951 0.8192 0.9774
65 0.8300 0.8038 0.7950 0.7510 0.7651 0.7706 0.7576 0.7847 0.9355
70 0.8014 0.7705 0.7594 0.7084 0.7254 0.7312 0.7202 0.7438 0.8862
75 0.7743 0.7377 0.7242 0.6647 0.6848 0.6906 0.6812 0.6926 0.8249
80 0.7427 0.7040 0.6875 0.6148 0.6354 0.6407 0.6316 0.6311 0.7515
85 0.6977 0.6590 0.6374 0.5556 0.5746 0.5790 0.5698 0.5594 0.6661
90 0.6393 0.6011 0.5723 0.4869 0.5024 0.5056 0.4960 0.4776 0.5686
95 0.5673 0.5302 0.4920 0.4090 0.4188 0.4205 0.4102 0.3855 0.4592
100 0.4818 0.4464 0.3965 0.3219 0.3239 0.3237 0.3122 0.2834 0.3379
105 0.3827 0.3497 0.2858 0.2255 0.2176 0.2151 0.2021 0.1711 0.2046
110 0.2700 0.2400 0.1600 0.1200 0.1000 0.0943 0.0800 0.0487 0.0594

Age High
Jump Pole Vault Long
Jump Shot Put Discus Hammer Javelin Weight
35 1.0205 1.0024 1.0323 1.0368 1.0000 1.0573 1.0236 1.0355
40 1.0715 1.0637 1.0905 1.1164 1.0733 1.1616 1.1298 1.1186
45 1.1255 1.1306 1.1537 1.2062 1.1772 1.2787 1.2495 1.2126
50 1.1826 1.2037 1.2226 1.1330 1.2949 1.2225 1.2650 1.1544
55 1.2430 1.2840 1.2982 1.2347 1.4300 1.3551 1.4077 1.2633
60 1.3071 1.3728 1.3814 1.3534 1.5873 1.5099 1.5732 1.1715
65 1.3751 1.4715 1.4736 1.4938 1.7735 1.6940 1.7680 1.3004
70 1.4473 1.5819 1.5764 1.6631 1.9985 1.9176 2.0006 1.4577
75 1.5242 1.7128 1.6928 1.5282 1.9717 1.6730 2.0428 1.3741
80 1.6061 1.8944 1.8499 1.7433 2.2786 1.9458 2.3589 1.5846
85 1.7029 2.1559 2.0771 2.0244 2.6843 2.3110 2.7698 1.8666
90 1.8509 2.5533 2.4193 2.4079 3.2477 2.8273 3.3387 2.2647
95 2.0785 3.2130 2.9746 2.9631 4.0861 3.6161 4.1830 2.8706
100 2.4406 4.4938 4.0010 3.8399 5.4702 4.9754 5.5753 3.9056
105 3.0671 7.9701 6.4700 5.1792 8.2642 7.6645 8.3220 5.9984
110 4.3478 50.0000 20.0000 7.0711 17.3205 13.1951 16.3299 12.2297

*/

W["60m"] = { 35: 1.0000, 40: 0.9985, 45: 0.9613, 50: 0.9259, 55: 0.8922, 60: 0.8603, 65: 0.8300, 70: 0.8014, 75: 0.7743, 80: 0.7427, 85: 0.6977, 90: 0.6393, 95: 0.5673, 100: 0.4818, 105: 0.3827, 110: 0.2700 };
W["100m"] = { 35: 1.0000, 40: 0.9810, 45: 0.9441, 50: 0.9080, 55: 0.8726, 60: 0.8379, 65: 0.8038, 70: 0.7705, 75: 0.7377, 80: 0.7040, 85: 0.6590, 90: 0.6011, 95: 0.5302, 100: 0.4464, 105: 0.3497, 110: 0.2400 };
W["200m"] = { 35: 1.0000, 40: 0.9787, 45: 0.9411, 50: 0.9040, 55: 0.8673, 60: 0.8309, 65: 0.7950, 70: 0.7594, 75: 0.7242, 80: 0.6875, 85: 0.6374, 90: 0.5723, 95: 0.4920, 100: 0.3965, 105: 0.2858, 110: 0.1600 };
W["400m"] = { 35: 0.9783, 40: 0.9441, 45: 0.9084, 50: 0.8711, 55: 0.8324, 60: 0.7924, 65: 0.7510, 70: 0.7084, 75: 0.6647, 80: 0.6148, 85: 0.5556, 90: 0.4869, 95: 0.4090, 100: 0.3219, 105: 0.2255, 110: 0.1200 };
W["800m"] = { 35: 0.9929, 40: 0.9563, 45: 0.9192, 50: 0.8814, 55: 0.8432, 60: 0.8044, 65: 0.7651, 70: 0.7254, 75: 0.6848, 80: 0.6354, 85: 0.5746, 90: 0.5024, 95: 0.4188, 100: 0.3239, 105: 0.2176, 110: 0.1000 };
W["1000m"] = { 35: 0.9995, 40: 0.9624, 45: 0.9248, 50: 0.8869, 55: 0.8485, 60: 0.8098, 65: 0.7706, 70: 0.7312, 75: 0.6906, 80: 0.6407, 85: 0.5790, 90: 0.5056, 95: 0.4205, 100: 0.3237, 105: 0.2151, 110: 0.0943 };
W["1500m"] = { 35: 0.9812, 40: 0.9441, 45: 0.9069, 50: 0.8697, 55: 0.8324, 60: 0.7951, 65: 0.7576, 70: 0.7202, 75: 0.6812, 80: 0.6316, 85: 0.5698, 90: 0.4960, 95: 0.4102, 100: 0.3122, 105: 0.2021, 110: 0.0800 };
W["60mH"] = { 35: 1.0000, 40: 0.9288, 45: 0.8980, 50: 0.8861, 55: 0.8530, 60: 0.8192, 65: 0.7847, 70: 0.7438, 75: 0.6926, 80: 0.6311, 85: 0.5594, 90: 0.4776, 95: 0.3855, 100: 0.2834, 105: 0.1711, 110: 0.0487 };
W["100mH"] = { 35: 0.9932, 40: 1.1368, 45: 1.0971, 50: 1.0597, 55: 1.0188, 60: 0.9774, 65: 0.9355, 70: 0.8862, 75: 0.8249, 80: 0.7515, 85: 0.6661, 90: 0.5686, 95: 0.4592, 100: 0.3379, 105: 0.2046, 110: 0.0594 };
W["HJ"] = { 35: 1.0205, 40: 1.0715, 45: 1.1255, 50: 1.1826, 55: 1.2430, 60: 1.3071, 65: 1.3751, 70: 1.4473, 75: 1.5242, 80: 1.6061, 85: 1.7029, 90: 1.8509, 95: 2.0785, 100: 2.4406, 105: 3.0671, 110: 4.3478 };
W["PV"] = { 35: 1.0024, 40: 1.0637, 45: 1.1306, 50: 1.2037, 55: 1.2840, 60: 1.3728, 65: 1.4715, 70: 1.5819, 75: 1.7128, 80: 1.8944, 85: 2.1559, 90: 2.5533, 95: 3.2130, 100: 4.4938, 105: 7.9701, 110: 50.0000 };
W["LJ"] = { 35: 1.0323, 40: 1.0905, 45: 1.1537, 50: 1.2226, 55: 1.2982, 60: 1.3814, 65: 1.4736, 70: 1.5764, 75: 1.6928, 80: 1.8499, 85: 2.0771, 90: 2.4193, 95: 2.9746, 100: 4.0010, 105: 6.4700, 110: 20.0000 };
W["SP"] = { 35: 1.0368, 40: 1.1164, 45: 1.2062, 50: 1.1330, 55: 1.2347, 60: 1.3534, 65: 1.4938, 70: 1.6631, 75: 1.5282, 80: 1.7433, 85: 2.0244, 90: 2.4079, 95: 2.9631, 100: 3.8399, 105: 5.1792, 110: 7.0711 };
W["DT"] = { 35: 1.0000, 40: 1.0733, 45: 1.1772, 50: 1.2949, 55: 1.4300, 60: 1.5873, 65: 1.7735, 70: 1.9985, 75: 1.9717, 80: 2.2786, 85: 2.6843, 90: 3.2477, 95: 4.0861, 100: 5.4702, 105: 8.2642, 110: 17.3205 };
W["HT"] = { 35: 1.0573, 40: 1.1616, 45: 1.2787, 50: 1.2225, 55: 1.3551, 60: 1.5099, 65: 1.6940, 70: 1.9176, 75: 1.6730, 80: 1.9458, 85: 2.3110, 90: 2.8273, 95: 3.6161, 100: 4.9754, 105: 7.6645, 110: 13.1951 };
W["JT"] = { 35: 1.0236, 40: 1.1298, 45: 1.2495, 50: 1.2650, 55: 1.4077, 60: 1.5732, 65: 1.7680, 70: 2.0006, 75: 2.0428, 80: 2.3589, 85: 2.7698, 90: 3.3387, 95: 4.1830, 100: 5.5753, 105: 8.3220, 110: 16.3299 };


/*
Age 60m 100m 200m 400m 800m 1000m 1500m 60m
Hurdles
Short
Hurdles
35 0.9991 0.9999 0.9791 0.9824 0.9965 0.9997 0.9849 1.0000 0.9957
40 0.9763 0.9668 0.9482 0.9513 0.9580 0.9629 0.9532 0.9698 0.9609
45 0.9526 0.9345 0.9179 0.9208 0.9205 0.9266 0.9206 0.9371 0.9244
50 0.9281 0.9031 0.8883 0.8909 0.8842 0.8908 0.8871 0.9132 0.9662
55 0.9029 0.8726 0.8594 0.8616 0.8489 0.8556 0.8527 0.8782 0.9230
60 0.8769 0.8429 0.8312 0.8329 0.8147 0.8208 0.8174 0.8732 0.9457
65 0.8502 0.8139 0.8035 0.8047 0.7814 0.7865 0.7814 0.8351 0.8958
70 0.8228 0.7858 0.7764 0.7770 0.7490 0.7527 0.7446 0.8174 1.0788
75 0.7946 0.7584 0.7500 0.7440 0.7169 0.7188 0.7070 0.7765 1.0111
80 0.7658 0.7317 0.7170 0.6970 0.6737 0.6756 0.6651 0.7249 0.9392
85 0.7264 0.6946 0.6669 0.6360 0.6156 0.6173 0.6076 0.6560 0.8483
90 0.6696 0.6396 0.5998 0.5609 0.5425 0.5436 0.5341 0.5699 0.7360
95 0.5956 0.5666 0.5156 0.4718 0.4544 0.4545 0.4446 0.4666 0.6025
100 0.5043 0.4757 0.4142 0.3686 0.3514 0.3500 0.3390 0.3461 0.4477
105 0.3958 0.3669 0.2957 0.2514 0.2332 0.2300 0.2175 0.2085 0.2719
110 0.2700 0.2400 0.1600 0.1200 0.1000 0.0939 0.0800 0.0538 0.0750

Age High
Jump Pole Vault Long
Jump Shot Put Discus Hammer Javelin Weight
35 1.0136 1.0129 1.0385 1.0462 1.0000 1.0000 1.0438 1.0000
40 1.0631 1.0708 1.0972 1.1125 1.0187 1.0496 1.1218 1.0668
45 1.1159 1.1351 1.1608 1.1867 1.0856 1.1190 1.2110 1.1405
50 1.1724 1.2070 1.2299 1.1551 1.0078 1.0911 1.2293 0.9978
55 1.2330 1.2881 1.3051 1.2420 1.0873 1.1783 1.3425 1.0704
60 1.2981 1.3800 1.3876 1.2252 0.9653 1.1709 1.3675 1.0071
65 1.3683 1.4854 1.4783 1.3317 1.0590 1.2865 1.5184 1.0854
70 1.4442 1.6073 1.5787 1.3036 1.1746 1.2785 1.5566 1.0263
75 1.5267 1.7502 1.6917 1.4385 1.3205 1.4403 1.7731 1.1233
80 1.6166 1.9199 1.8448 1.3885 1.5103 1.4301 1.8402 1.0544
85 1.7149 2.1548 2.0674 1.5671 1.7672 1.6779 2.1894 1.2044
90 1.8493 2.5212 2.4042 1.7971 2.1341 2.0327 2.6989 1.4230
95 2.0563 3.1395 2.9522 2.1043 2.7000 2.5823 3.4861 1.7680
100 2.3825 4.3531 3.9676 2.5361 3.6863 3.5446 4.7841 2.3883
105 2.9328 7.6795 6.4179 3.1876 5.8353 5.5959 7.2999 3.8185
110 4.0000 50.0000 20.0000 4.2841 14.1421 12.8565 14.1421 10.5283

*/

M["60m"] = { 35: 0.9991, 40: 0.9763, 45: 0.9526, 50: 0.9281, 55: 0.9029, 60: 0.8769, 65: 0.8502, 70: 0.8228, 75: 0.7946, 80: 0.7658, 85: 0.7264, 90: 0.6696, 95: 0.5956, 100: 0.5043, 105: 0.3958, 110: 0.2700 };
M["100m"] = { 35: 0.9999, 40: 0.9668, 45: 0.9345, 50: 0.9031, 55: 0.8726, 60: 0.8429, 65: 0.8139, 70: 0.7858, 75: 0.7584, 80: 0.7317, 85: 0.6946, 90: 0.6396, 95: 0.5666, 100: 0.4757, 105: 0.3669, 110: 0.2400 };
M["200m"] = { 35: 0.9791, 40: 0.9482, 45: 0.9179, 50: 0.8883, 55: 0.8594, 60: 0.8312, 65: 0.8035, 70: 0.7764, 75: 0.7500, 80: 0.7170, 85: 0.6669, 90: 0.5998, 95: 0.5156, 100: 0.4142, 105: 0.2957, 110: 0.1600 };
M["400m"] = { 35: 0.9824, 40: 0.9513, 45: 0.9208, 50: 0.8909, 55: 0.8616, 60: 0.8329, 65: 0.8047, 70: 0.7770, 75: 0.7440, 80: 0.6970, 85: 0.6360, 90: 0.5609, 95: 0.4718, 100: 0.3686, 105: 0.2514, 110: 0.1200 };
M["800m"] = { 35: 0.9965, 40: 0.9580, 45: 0.9205, 50: 0.8842, 55: 0.8489, 60: 0.8147, 65: 0.7814, 70: 0.7490, 75: 0.7169, 80: 0.6737, 85: 0.6156, 90: 0.5425, 95: 0.4544, 100: 0.3514, 105: 0.2332, 110: 0.1000 };
M["1000m"] = { 35: 0.9997, 40: 0.9629, 45: 0.9266, 50: 0.8908, 55: 0.8556, 60: 0.8208, 65: 0.7865, 70: 0.7527, 75: 0.7188, 80: 0.6756, 85: 0.6173, 90: 0.5436, 95: 0.4545, 100: 0.3500, 105: 0.2300, 110: 0.0939 };
M["1500m"] = { 35: 0.9849, 40: 0.9532, 45: 0.9206, 50: 0.8871, 55: 0.8527, 60: 0.8174, 65: 0.7814, 70: 0.7446, 75: 0.7070, 80: 0.6651, 85: 0.6076, 90: 0.5341, 95: 0.4446, 100: 0.3390, 105: 0.2175, 110: 0.0800 };
M["60mH"] = { 35: 1.0000, 40: 0.9698, 45: 0.9371, 50: 0.9132, 55: 0.8782, 60: 0.8732, 65: 0.8351, 70: 0.8174, 75: 0.7765, 80: 0.7249, 85: 0.6560, 90: 0.5699, 95: 0.4666, 100: 0.3461, 105: 0.2085, 110: 0.0538 };
M["110mH"] = { 35: 0.9957, 40: 0.9609, 45: 0.9244, 50: 0.9662, 55: 0.9230, 60: 0.9457, 65: 0.8958, 70: 1.0788, 75: 1.0111, 80: 0.9392, 85: 0.8483, 90: 0.7360, 95: 0.6025, 100: 0.4477, 105: 0.2719, 110: 0.0750 };
M["HJ"] = { 35: 1.0136, 40: 1.0631, 45: 1.1159, 50: 1.1724, 55: 1.2330, 60: 1.2981, 65: 1.3683, 70: 1.4442, 75: 1.5267, 80: 1.6166, 85: 1.7149, 90: 1.8493, 95: 2.0563, 100: 2.3825, 105: 2.9328, 110: 4.0000 };
M["PV"] = { 35: 1.0129, 40: 1.0708, 45: 1.1351, 50: 1.2070, 55: 1.2881, 60: 1.3800, 65: 1.4854, 70: 1.6073, 75: 1.7502, 80: 1.9199, 85: 2.1548, 90: 2.5212, 95: 3.1395, 100: 4.3531, 105: 7.6795, 110: 50.0000 };
M["LJ"] = { 35: 1.0385, 40: 1.0972, 45: 1.1608, 50: 1.2299, 55: 1.3051, 60: 1.3876, 65: 1.4783, 70: 1.5787, 75: 1.6917, 80: 1.8448, 85: 2.0674, 90: 2.4042, 95: 2.9522, 100: 3.9676, 105: 6.4179, 110: 20.0000 };
M["SP"] = { 35: 1.0462, 40: 1.1125, 45: 1.1867, 50: 1.1551, 55: 1.2420, 60: 1.2252, 65: 1.3317, 70: 1.3036, 75: 1.4385, 80: 1.3885, 85: 1.5671, 90: 1.7971, 95: 2.1043, 100: 2.5361, 105: 3.1876, 110: 4.2841 };
M["DT"] = { 35: 1.0000, 40: 1.0187, 45: 1.0856, 50: 1.0078, 55: 1.0873, 60: 0.9653, 65: 1.0590, 70: 1.1746, 75: 1.3205, 80: 1.5103, 85: 1.7672, 90: 2.1341, 95: 2.7000, 100: 3.6863, 105: 5.8353, 110: 14.1421 };
M["HT"] = { 35: 1.0000, 40: 1.0496, 45: 1.1190, 50: 1.0911, 55: 1.1783, 60: 1.1709, 65: 1.2865, 70: 1.2785, 75: 1.4403, 80: 1.4301, 85: 1.6779, 90: 2.0327, 95: 2.5823, 100: 3.5446, 105: 5.5959, 110: 12.8565 };
M["JT"] = { 35: 1.0438, 40: 1.1218, 45: 1.2110, 50: 1.2293, 55: 1.3425, 60: 1.3675, 65: 1.5184, 70: 1.5566, 75: 1.7731, 80: 1.8402, 85: 2.1894, 90: 2.6989, 95: 3.4861, 100: 4.7841, 105: 7.2999, 110: 14.1421 };
