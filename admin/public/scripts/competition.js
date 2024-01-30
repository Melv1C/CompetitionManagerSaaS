const urlParams = new URLSearchParams(window.location.search);
const competitionId = urlParams.get('id');

const overlay = document.getElementById("overlay");

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

const sendModifInfo = document.getElementById("sendModifInfo");
sendModifInfo.addEventListener("click", function(){
    const name = document.getElementById('nameInput').value;
    const date = document.getElementById('dateInput').value;
    const location = document.getElementById('locationInput').value;
    const competitionData = {
        name: name,
        date: date,
        location: location
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