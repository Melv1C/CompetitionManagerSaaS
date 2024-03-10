
function formatRecord(eventType, record) {
    record = parseFloat(record);
    switch (eventType) {
        case 'time':
            return formatTime(record);
        case 'distance':
            return formatDistance(record);
        case 'points':
            return formatHeight(record);
        default:
            return record;
    }
}

function formatTime(record) {
    if (record === 0) {
        return 'Pas de record';
    }

    const time = new Date(0);
    time.setMilliseconds(record);
    
    const minutes = time.getUTCMinutes();
    const seconds = time.getUTCSeconds();
    const milliseconds = time.getUTCMilliseconds();

    if (minutes === 0) {
        return `${seconds}"${parseInt(milliseconds / 10).toString().padStart(2, '0')}`;
    }

    return `${minutes}"${seconds.toString().padStart(2, '0')}'${parseInt(milliseconds / 10).toString().padStart(2, '0')}`;
}

function formatDistance(record) {
    if (record === 0) {
        return 'Pas de record';
    }
    return record + ' m';
}

function formatHeight(record) {
    if (record === 0) {
        return 'Pas de record';
    }
    return record + ' pts';
}


export { formatRecord };