// SIGN IN
const btn = document.getElementById("login");

var url_string = window.location;
var url = new URL(url_string);
var deviceID = url.searchParams.get("deviceID");
function convertTZ(date, tzString) {
  return new Date((typeof date === "string" ? new Date(date) : date).toLocaleString("en-US", { timeZone: tzString }));
}

// function readUserData(uID, n) {
//   firebase.database().ref.child("persona").child(n).get().then((snapshot) => {
//     if (snapshot.exists()) {
//       console.log(snapshot.val());
//     } else {
//       console.log("No data available");
//     }
//   }).catch((error) => {
//     console.error(error);
//   });
// }

btn.addEventListener("click", (e) => {
  console.log('Jalo')
  e.preventDefault();
  const provider = new firebase.auth.GoogleAuthProvider();

  auth.signInWithPopup(provider).then((result) => {
    console.log(result);
    console.log("google sign in");
    localStorage.setItem("deviceid", `${deviceID}`);
    localStorage.setItem("uid", `${result.user.uid}`);
    localStorage.setItem("email", `${result.user.email}`);
    location.href = "loggedIn.html"
  })
    .catch(err => {
      console.log(err);
    })

});








