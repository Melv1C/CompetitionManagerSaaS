const urlParams = new URLSearchParams(window.location.search);
const competitionId = urlParams.get('id');

const overlay = document.getElementById("overlay");

const nameInput = document.getElementById('name');
const locationInput = document.getElementById('location');
const clubInput = document.getElementById('club');
const dateInput = document.getElementById('date');
const paidInput = document.getElementById('paid');
const freeClubInput = document.getElementById('freeClub');
const scheduleInput = document.getElementById('schedule');
const descriptionInput = document.getElementById('description');



function openPopup(popup){
    popup.style.display = "block";
    overlay.style.display = "block";
}

function closePopup(popup){
    popup.style.display = "none";
    overlay.style.display = "none";
}

const popupModifInfo = document.getElementById("popupModifInfo");
const popupModifInfoClose = document.getElementById("popupModifInfoClose");
popupModifInfoClose.addEventListener("click", function(){
    closePopup(popupModifInfo);
});

document.getElementById("modifInfo").addEventListener("click", function(){
    openPopup(popupModifInfo);
});

const cancelModifInfo = document.getElementById("cancelModifInfo");
cancelModifInfo.addEventListener("click", function(){
    closePopup(popupModifInfo);
});

const popupAddEpr = document.getElementById("popupAddEpr");
const popupAddEprClose = document.getElementById("popupAddEprClose");
popupAddEprClose.addEventListener("click", function(){
    closePopup(popupAddEpr);
});

document.getElementById("addEpr").addEventListener("click", function(){
    openPopup(popupAddEpr);
});

const cancelAddEpr = document.getElementById("cancelAddEpr");
cancelAddEpr.addEventListener("click", function(){
    closePopup(popupAddEpr);
});


const sendModifInfo = document.getElementById("sendModifInfo");
sendModifInfo.addEventListener("click", function(){
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
    fetch('/admin/competition?id=' + competitionId, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(competitionData),
    }).then((response) => {
        if (response.status === 200) {
            window.location.reload();
        }else{
            alert(response.message);
        }
    })
    //todo
    closePopup(popupModifInfo);
});