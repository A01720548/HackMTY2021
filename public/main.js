// SIGN IN
const btn = document.getElementById("login");

var url_string = window.location;
var url = new URL(url_string);
var deviceID = url.searchParams.get("deviceID");

function writeUserData(uid, deviceID) {
  firebase.database().ref('persona/' + uid).set({
    uid: uid,
    deviceID : deviceID
  });
}

btn.addEventListener("click", (e) => {
  console.log('Jalo')
  e.preventDefault();

  const provider = new firebase.auth.GoogleAuthProvider();
  auth.signInWithPopup(provider).then((result) => {
    console.log(result);
    console.log("google sign in");

    writeUserData(result.user.uid, deviceID)

  })
  .catch(err => {
    console.log(err);
  })
});





