import { Abbr, AbbrBaseCategory, Gender } from "@competition-manager/schemas";


export const getCategoryAbbr = (birthdate: Date, gender: Gender, referenceDate: Date = new Date()): Abbr => {
    const age = getAge(birthdate, referenceDate);
    
    if (age >= 35) {
        const masterAge = Math.floor(age / 5) * 5;
        return `${gender === Gender.M ? 'M' : 'W'}${masterAge}`;
    }

    const year = referenceDate.getFullYear() - birthdate.getFullYear() + (referenceDate.getMonth() >= birthdate.getMonth() ? 1 : 0);

    switch (year) {
        case 0: case 1: case 2: case 3: case 4: case 5: case 6: case 7:
            return `${AbbrBaseCategory.KAN} ${gender}`;      
        case 8: case 9:
            return `${AbbrBaseCategory.BEN} ${gender}`;
        case 10: case 11:
            return `${AbbrBaseCategory.PUP} ${gender}`;
        case 12: case 13:
            return `${AbbrBaseCategory.MIN} ${gender}`;
        case 14: case 15:
            return `${AbbrBaseCategory.CAD} ${gender}`;
        case 16: case 17:
            return `${AbbrBaseCategory.SCO} ${gender}`;
        case 18: case 19:
            return `${AbbrBaseCategory.JUN} ${gender}`; 
        case 20: case 21: case 22:
            return `${AbbrBaseCategory.ESP} ${gender}`;
        default:
            return `${AbbrBaseCategory.SEN} ${gender}`;
    }
}


const getAge = (birthdate: Date, referenceDate: Date = new Date()): number => {
    const isBirthdayPassed = referenceDate.getMonth() > birthdate.getMonth() || (referenceDate.getMonth() === birthdate.getMonth() && referenceDate.getDate() >= birthdate.getDate());
    return referenceDate.getFullYear() - birthdate.getFullYear() - (isBirthdayPassed ? 0 : 1);
}