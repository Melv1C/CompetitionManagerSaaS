import { EventType } from "@competition-manager/schemas";

export const formatPerf = (perf: number | undefined | null, eventType: EventType) => {

    if (perf === undefined || perf === null) {
        return '-';
    }

    switch (eventType) {
        case EventType.TIME: {
            // the perf is in milliseconds
            const minutes = Math.floor(perf / 60000);
            const seconds = Math.floor((perf % 60000) / 1000);
            const centiseconds = Math.ceil((perf % 1000) / 10);

            if (minutes > 0) {
                return `${minutes}'${seconds.toString().padStart(2, '0')}"${centiseconds.toString().padStart(2, '0')}`;
            } else {
                return `${seconds}"${centiseconds.toString().padStart(2, '0')}`;
            }
        }

        case EventType.DISTANCE:
        case EventType.HEIGHT:
            // the perf is in centimeters
            return `${perf} m`;
        default:
            return perf;
    }
}