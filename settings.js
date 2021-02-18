const messageForm = document.querySelector("#username-form"); // Input form
const inputField = document.querySelector("#msg-input");
const usernameTitle = document.querySelector("#username-title");

var user = firebase.auth().currentUser;

firebase.auth().onAuthStateChanged(function (user) {
  if (user) {
    localUsername = user.displayName;
  } else {
    // If not logged in redirect to loginpage
    window.location.replace("login.html");
  }
});

messageForm.addEventListener('submit', changeName);

function changeName(e) {
  e.preventDefault();
  const newUsername = inputField.value.trim();
  var user = firebase.auth().currentUser;

  user.updateProfile({
    displayName: newUsername
  }).then(function () {
    console.log("Name updated!");
    usernameTitle.innerHTML = "Username changed to " + newUsername + "!";
  }).catch(function (error) {
    console.log("Fail!");
  });
  messageForm.reset();
}