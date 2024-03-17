
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
    if (!input.pseudoName && typeof input.pseudoName !== 'string'){
        return (false, 'Invalid pseudoName');
    }
    if (!input.time && typeof input.time !== 'string'){
        return (false, 'Invalid time');
    }
    if (!input.categories && !Array.isArray(input.categories)){
        return (false, 'Invalid categories');
    }
    if (!input.maxParticipants && typeof input.maxParticipants !== 'number'){
        return (false, 'Invalid maxParticipants');
    }
    if (!input.cost && typeof input.cost !== 'number'){
        return (false, 'Invalid cost');
    }
    if (!input.type && typeof input.type !== 'string'){
        return (false, 'Invalid name');
    }
    if (!input.subEvents && !Array.isArray(input.subEvents)){
        return (false, 'Invalid subEvents');
    }
    if (!input.categories && !Array.isArray(input.categories)){
        return res.status(400).json({
            status: 'error',
            message: 'Invalid categories',
        });
    }
    return (true, 'Valid input');
}   

module.exports = { checkInputCompetitions, checkInputEvents };










