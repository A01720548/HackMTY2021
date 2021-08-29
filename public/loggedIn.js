var h2 = document.getElementById('deviceText');
let todaysDate = new Date().toLocaleDateString('es-MX').replaceAll('/','');
h2.innerHTML = `You Scanned Device: ${localStorage.deviceid}`;
let hashKey;

const btnUnlink = document.getElementById("unlink");
const btnLink = document.getElementById("link");

function writeUserDataLink(uid, deviceID, email) {
    hashKey = firebase.database().ref('persons/').push({
        uid: uid,
        deviceID: deviceID,
        date: new Date().toLocaleString('es-MX', { timeZone: 'America/Monterrey' }),
        dateEnd: 0,
        email: email
    }).key;

    firebase.database().ref(`pairs/${deviceID}`).set({ // estaba en set
        deviceID:deviceID,
        hash: hashKey,
    });
}
function writeUserDataUnlink(uid, deviceID) {
    firebase.database().ref(`persons/${hashKey}`).update({
        dateEnd: new Date().toLocaleString('es-MX', { timeZone: 'America/Monterrey' }),
    });

    firebase.database().ref(`pairs/${deviceID}`).set({ // estaba en set
        deviceID:deviceID,
        hash: null
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
    //location.href = "loggedOut.html"
});

