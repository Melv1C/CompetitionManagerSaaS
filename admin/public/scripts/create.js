const createBtn = document.getElementById('createBtn');
const createForm = document.getElementById('createForm');
const nameInput = document.getElementById('name');
const locationInput = document.getElementById('location');
const clubInput = document.getElementById('club');
const dateInput = document.getElementById('date');
const paidInput = document.getElementById('paid');
const freeClubInput = document.getElementById('freeClub');
const scheduleInput = document.getElementById('schedule');
const descriptionInput = document.getElementById('description');

function validateForm() {
    const competitionData = {
        name: nameInput.value,
        location: locationInput.value,
        club: clubInput.value,
        date: dateInput.value,
        paid: paidInput.checked,
    };
    for (const key in competitionData) {
        if (competitionData[key] === '') {
            createBtn.disabled = true;
            return;
        }
    }
    createBtn.disabled = false;
}

nameInput.addEventListener('input', validateForm);
locationInput.addEventListener('input', validateForm);
clubInput.addEventListener('input', validateForm);
dateInput.addEventListener('input', validateForm);
paidInput.addEventListener('input', validateForm);

createBtn.addEventListener('click', function (event) {
    const competitionData = {
        name: nameInput.value,
        location: locationInput.value,
        club: clubInput.value,
        date: dateInput.value,
        paid: paidInput.checked,
        freeClub: freeClubInput.value,
        schedule: scheduleInput.value,
        description: descriptionInput.value,
    };
    console.log(competitionData)
    fetch(`/admin/competition`, {
        method: 'POST',
        body: JSON.stringify(competitionData),
        headers: {
            'content-type': 'application/json',
        },
    }).then(res => {
        if (res.ok) {
            return res.json();
        }
        console.log(res);
    }).then(data => {
        window.location.href = `/admin/competition?id=${data.data.id}`;
    }).catch(err => {
        alert(err.message);
    });
});


