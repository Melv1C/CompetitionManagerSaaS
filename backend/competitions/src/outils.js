
function checkInputCompetitions(input) {
    if (!input.name && typeof input.name !== 'string'){
        return (false, 'Invalid name');
    }
    if (!input.location && typeof input.location !== 'string'){
        return (false, 'Invalid location');
    }
    if (!input.club && typeof input.club !== 'string'){
        return (false, 'Invalid club');
    }
    if (!input.date && typeof input.date !== 'string'){
        return (false, 'Invalid date');
    }
    if (!input.closeDate && typeof input.closeDate !== 'string'){
        return (false, 'Invalid closeDate');
    }
    if (!input.paid && typeof input.paid !== 'boolean'){
        return (false, 'Invalid paid');
    }
    if (!input.schedule && typeof input.schedule !== 'string'){
        return (false, 'Invalid schedule');
    }
    if (!input.description && typeof input.description !== 'string'){
        return (false, 'Invalid description');
    }
    if (!input.adminId && typeof input.adminId !== 'string'){
        return (false, 'Invalid adminId');
    }
    if (!input.email && typeof input.email !== 'string'){
        return (false, 'Invalid email');
    }
    if (!input.confirmationTime && typeof input.confirmationTime !== 'number'){
        return (false, 'Invalid confirmationTime');
    }
    if (!input.oneDay && typeof input.oneDay !== 'boolean'){
        return (false, 'Invalid oneDay');
    }
    if (!input.oneDayBIB && typeof input.oneDayBIB !== 'number'){
        return (false, 'Invalid oneDayBIB');
    }
    return (true, 'Valid input');
}

function checkInputEvents(input) {
    if (!input.name && typeof input.name !== 'string'){
        return (false, 'Invalid name');
    }
    if (!pseudoName && typeof pseudoName !== 'string'){
        return (false, 'Invalid pseudoName');
    }
    if (!time && typeof time !== 'string'){
        return (false, 'Invalid time');
    }
    if (!categories && !Array.isArray(categories)){
        return (false, 'Invalid categories');
    }
    if (!maxParticipants && typeof maxParticipants !== 'number'){
        return (false, 'Invalid maxParticipants');
    }
    if (!cost && typeof cost !== 'number'){
        return (false, 'Invalid cost');
    }
    if (!type && typeof type !== 'string'){
        return (false, 'Invalid name');
    }
    if (!subEvents && !Array.isArray(subEvents)){
        return (false, 'Invalid subEvents');
    }
    if (!categories && !Array.isArray(categories)){
        return res.status(400).json({
            status: 'error',
            message: 'Invalid categories',
        });
    }
    return (true, 'Valid input');
}   

module.exports = { checkInputCompetitions, checkInputEvents };










