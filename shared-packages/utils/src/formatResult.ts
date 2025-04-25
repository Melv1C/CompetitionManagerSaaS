import {
    AttemptValue,
    EventType,
    Result,
    ResultDetail,
    ResultDetailCode,
} from '@competition-manager/schemas';

export const formatResult = (result: Result) => {
    // Check if the result has a value and is not 0
    if (
        result.value !== undefined &&
        result.value !== null &&
        result.value !== 0
    ) {
        return formatPerf(result.value, result.competitionEvent.event.type);
    }
    // Handle special result codes

    // If there is no details, return empty string
    if (result.details.length === 0) {
        return '';
    }
    // If there is only one detail
    // and it has only one attempt, and the attempt is 'R'
    // or the detail value is 'R'
    // then return 'DNS'
    if (
        result.details.length === 1 &&
        ((result.details[0].attempts.length === 1 &&
            result.details[0].attempts[0] === AttemptValue.R) ||
            result.details[0].value === ResultDetailCode.R)
    ) {
        return 'DNS';
    }
    // If all the details are AttemptValue.PASS or the value is ResultDetailCode.PASS
    // then return an empty string
    if (
        result.details.every(
            (detail) =>
                detail.attempts.length === 1 &&
                detail.attempts[0] === AttemptValue.PASS
        ) ||
        result.details.every(
            (detail) => detail.value === ResultDetailCode.PASS
        )
    ) {
        return '';
    }
    // Else, return 'NM'
    return 'NM';
};

export const formatResultDetail = (
    resultDetail: Pick<ResultDetail, 'value' | 'attempts'>,
    eventType: EventType
) => {
    return formatPerf(resultDetail.value, eventType);
};

export const formatPerf = (
    perf: number | undefined | null,
    eventType: EventType
) => {
    if (perf === undefined || perf === null) {
        return '-';
    }

    if (perf < 0) {
        // Handle special result codes
        switch (perf) {
            case ResultDetailCode.X:
                return 'X';
            case ResultDetailCode.PASS:
                return '-';
            case ResultDetailCode.R:
                return 'r';
            default:
                return perf;
        }
    }

    switch (eventType) {
        case EventType.TIME: {
            // the perf is in milliseconds
            const minutes = Math.floor(perf / 60000);
            const seconds = Math.floor((perf % 60000) / 1000);
            const centiseconds = Math.ceil((perf % 1000) / 10);

            if (minutes > 0) {
                return `${minutes}'${seconds
                    .toString()
                    .padStart(2, '0')}"${centiseconds
                    .toString()
                    .padStart(2, '0')}`;
            } else {
                return `${seconds}"${centiseconds.toString().padStart(2, '0')}`;
            }
        }

        case EventType.DISTANCE:
        case EventType.HEIGHT:
            // the perf is in meters, format to 2 decimal places
            return `${perf.toFixed(2)} m`;
        default:
            return perf;
    }
};
