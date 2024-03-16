const dico = {
    "BEN": 0,
    "PUP": 1,
    "MIN": 2,
    "CAD": 3,
    "SCO": 4,
    "JUN": 5,
    "SEN": 6
}

export const SortCategory = (categories) => {
    console.log(categories);
    let uniqueCategories = [...new Set(categories)];
    console.log(uniqueCategories);
    uniqueCategories.sort((a, b) => {
        let aCat = a.split(" ")[0];
        let bCat = b.split(" ")[0];
        if (dico[aCat] < dico[bCat]) {
            return -1;
        }
        if (dico[aCat] > dico[bCat]) {
            return 1;
        }
        return 0;
    });
    console.log(uniqueCategories);
    return uniqueCategories;
}

export const groupByGender = (categories) => {
    let male = [];
    let female = [];
    categories.forEach(category => {
        if (category.includes("M")) {
            male.push(category);
        } else if (category.includes("F") || category.includes("W")) {
            female.push(category);
        }
    });
    return { male, female };
}
