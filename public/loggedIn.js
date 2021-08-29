var h2 = document.getElementById('deviceText');

h2.innerHTML = `You are currently linked to device: ${localStorage.deviceid}`;

const btnUnlink = document.getElementById("unlink");
const btnLink = document.getElementById("link");

function writeUserDataLink(uid, deviceID, email) {
    firebase.database().ref('persona/' + uid + deviceID).set({
        uid: uid,
        deviceID: deviceID,
        date: new Date().toLocaleString('es-MX', { timeZone: 'America/Monterrey' }),
        dateEnd: new Date().toLocaleString('es-MX', { timeZone: 'America/Monterrey' }),
        email: email
    });
}
function writeUserDataUnlink(uid, deviceID) {
    firebase.database().ref('persona/' + uid + deviceID).update({
        dateEnd: new Date().toLocaleString('es-MX', { timeZone: 'America/Monterrey' }),
    });
}


btnLink.addEventListener("click", (e) => {
    console.log('Jalo')
    e.preventDefault();
    writeUserDataLink(localStorage.uid, localStorage.deviceid, localStorage.email);
});

btnUnlink.addEventListener("click", (e) => {
    console.log('Jalo')
    e.preventDefault();
    writeUserDataUnlink(localStorage.uid, localStorage.deviceid);
    location.href = "loggetOut.html"
});

