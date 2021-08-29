var h2 = document.getElementById('deviceText');
// let todaysDate = new Date().toLocaleDateString('es-MX').replaceAll('/','');
h2.innerHTML = `You Scanned Device: ${localStorage.deviceid}`;
let hashKey;

const btnUnlink = document.getElementById("unlink");
const btnLink = document.getElementById("link");
const btnSos = document.getElementById("sos");

function writeUserDataLink(uid, deviceID, email) {
    hashKey = firebase.database().ref('persons/').push({
        uid: uid,
        deviceID: deviceID,
        date: new Date().toLocaleString('es-MX', { timeZone: 'America/Monterrey' }),
        dateEnd: 0,
        email: email
    }).key;

    firebase.database().ref(`pairs/${deviceID}`).set({ // estaba en set
        hash: hashKey,
    });
}


function writeUserDataUnlink(uid, deviceID) {
    firebase.database().ref('pairs/'+deviceID).on('value', function(snapshot){
        hashKey = snapshot.val().hash;
        console.log(snapshot.val().hash)
    });
    setTimeout(() => {
        firebase.database().ref(`persons/${hashKey}`).update({
        dateEnd: new Date().toLocaleString('es-MX', { timeZone: 'America/Monterrey' }),
        });

        firebase.database().ref(`pairs/${deviceID}`).set({ // estaba en set
        hash: null
        });
    }, 100);
    
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

btnSos.addEventListener("click", (e) => {
    console.log('Jalo')
    e.preventDefault();

    arrHashes = [];
    //location.href = "loggedOut.html"
    firebase.database().ref('persons/').on('value', function(snapshot){
        arrHashes.push()
    });
});

