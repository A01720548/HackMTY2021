var h2 = document.getElementById('deviceText');
// let todaysDate = new Date().toLocaleDateString('es-MX').replaceAll('/','');
h2.innerHTML = `You Scanned TraceBand: #${localStorage.deviceid}`;
let hashKey;
let arrHashes = [];
let emailArray = [];
let uniqueMails;

firebase.database().ref('pairs/' + localStorage.deviceid).on('value', function (snapshot) {
    hashKey = snapshot.val()?.hash;
    console.log(snapshot.val()?.hash)
});

const btnUnlink = document.getElementById("unlink");
const btnLink = document.getElementById("link");
const btnSos = document.getElementById("sos");

function writeUserDataLink(uid, deviceID, email) {
    hashKey = firebase.database().ref('persons/').push({
        uid: uid,
        deviceID: deviceID,
        date: new Date().toLocaleString('es-MX', { timeZone: 'America/Monterrey' }),
        dateEnd: 0,
        email: email,
        contacts: ['']
    }).key;

    firebase.database().ref(`pairs/${deviceID}`).set({ // estaba en set
        hash: hashKey,
    });

    setTimeout(() => {
        location.href = "linked.html"
    }, 1000);
}


function writeUserDataUnlink(uid, deviceID) {
    firebase.database().ref('pairs/' + deviceID).on('value', function (snapshot) {
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

    setTimeout(() => {
        location.href = "loggedOut.html"
    }, 1000);
});

btnSos.addEventListener("click", (e) => {
    console.log('Jalo')
    e.preventDefault();

    //location.href = "loggedOut.html"
    let counter = 0;
    let keys;
    firebase.database().ref().child('persons/').on('value', function (snapshot) {
        keys = Object.keys(snapshot.val());
        console.log(snapshot.val())
        var childKey = snapshot.child(`persons/${keys[0]}`).key;
        console.log(childKey)
        console.log(snapshot.val()[`${childKey}`].uid)
        console.log(localStorage.uid)
        for (let i = 0; i < keys.length; i++) {
            var childKey = snapshot.child(`persons/${keys[i]}`).key;
            if (snapshot.val()[`${childKey}`].uid === localStorage.uid) {
                console.log('Hello w')

                propertyNames = Object.values(snapshot.val()[`${childKey}`].contacts);
                console.log(propertyNames)
                arrHashes.push(propertyNames)
            }
        }

        emailArray = arrHashes.flat();
        uniqueMails = [...new Set(emailArray)]
        console.log(uniqueMails)
        setTimeout(() => {
            for (let i = 0; i < uniqueMails.length; i++) {
                Email.send({
                    Host: "smtp.elasticemail.com",
                    Username: "a01720623@itesm.mx",
                    Password: "005AECA979896234318883738E17D1056B96",
                    To: uniqueMails[i],
                    From: "a01720623@itesm.mx",
                    Subject: "COVID WARNING",
                    Body: "Someone you were in contact with started presenting symptoms."
                })
            }
        }, 1000);

    });

    setTimeout(() => {
        location.href = "covid.html"
    }, 1000);
});

