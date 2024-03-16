const dicoCat = {
    "KAN M":1,
    "KAN F":2,
    "BEN M":3,
    "BEN F":4,
    "PUP M":5,
    "PUP F":6,
    "MIN M":7,
    "MIN F":8,
    "CAD M":9,
    "CAD F":10,
    "SCO M":11,
    "SCO F":12,
    "JUN M":13,
    "JUN F":14,
    "SEN M":15,
    "SEN F":16,
}

export const SortCategory = (categories) => {
    let uniqueCategories = [...new Set(categories)];
    uniqueCategories.sort((a, b) => {
        if (dicoCat[a] !== undefined && dicoCat[b] !== undefined) {
            return dicoCat[a] - dicoCat[b];
        }else if (dicoCat[a] !== undefined) {
            return -1000;
        }else if (dicoCat[b] !== undefined) {
            return 1000;
        }else{
            return a.localeCompare(b);
        }
    });
    return uniqueCategories;
}

export const groupByGender = (categories) => {
    let male = [];
    let female = [];
    categories.forEach(category => {
        if (category.includes("F") || category.includes("W")) {
            female.push(category);
        } else if (category.includes("M")) {
            male.push(category);
        }
    });
    return { male, female };
}
