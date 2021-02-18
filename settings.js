const signOutBtn = document.querySelector("#sign-out-btn");

const db = firebase.firestore();
const chats = db.collection("chats"); // Reference to the chats folder on firebase

// Check if user is logged in, save name.

firebase.auth().onAuthStateChanged(function (user) {
  if (user) {
    localUsername = user.displayName;
  } else {
    // If not logged in redirect to loginpage
    window.location.replace("login.html");
  }
});

signOutBtn.addEventListener("click", signOut);

function signOut() {
  firebase.auth().signOut().then(() => {
    console.log("You have been signed out");
    window.location.replace("login.html");
  }).catch((error) => {
    console.log("There was an error!")
  });
}