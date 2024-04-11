
function getGlobalStatus(inscriptions){
    if (inscriptions == null || inscriptions.length === 0) {
        return 'Loading...';
    }

    const confirmed = inscriptions[0].confirmed
    let status = confirmed ? 'Confirmé' : 'Non confirmé';
    if (inscriptions[0].absent) {
        status = 'Absent';
        return status;
    }

    for (const inscription of inscriptions) {
        if (!inscription.absent && status === 'Absent') {
            status = 'Erreur partiellement absent';
            return status;
        }
        else if (inscription.absent && status !== 'Absent') {
            status = 'Erreur partiellement absent';
            return status;
        }
        else if (inscription.confirmed !== confirmed) {
            status = 'Erreur Partiellement confirmé';
            return status;
        }
    }
    return status;
}

function getSingleStatus(inscription){
    if (inscription == null) {
        return 'Loading...';
    }
    
    if (inscription.absent) {
        return 'Absent';
    }

    return inscription.confirmed ? 'Confirmé' : 'Non confirmé';
}

function getColorClass(status){
    switch (status) {
        case 'Confirmé':
            return 'Confirmed';
        case 'Non confirmé':
            return 'Pending';
        case 'Absent':
            return 'Absent';
        case "changed":
            return 'Changed';
        default:
            return '';
    }
}




export { 
    getGlobalStatus, 
    getSingleStatus,
    getColorClass
};














