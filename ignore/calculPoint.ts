import { MEN_FACTOR, WOMEN_FACTOR } from "./tablePoints/Factor";
/*
Track Events: P = a *(b - T )**c (where T is Time in seconds
Jumps: P = a*(M-b)**c (where M is Measurement in centimetres)
Throws: P = a*(D-b )**c (where D is Distance in meters)
*/

function calculatePoints(
    event: string,
    gender: string,
    value: number,
    eventType: string
): number {
    const factor: { a: number; b: number; c: number } =
    gender === "M" ? MEN_FACTOR[event] : WOMEN_FACTOR[event];

    let points = 0;

    switch (eventType) {
        case "track":
            points = factor.a * (factor.b - value) ** factor.c;
            break;
        case "jump":
            points = factor.a * (value - factor.b) ** factor.c;
            break;
        case "throw":
            points = factor.a * (value - factor.b) ** factor.c;
            break;
        default:
            break;
    }

    return Math.floor(points);
}

