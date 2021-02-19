const usernameForm = document.querySelector("#username-form");
const passwordForm = document.querySelector("#password-form");
const inputField = document.querySelector("#msg-input");
const usernameTitle = document.querySelector("#username-title");
const passwordTitle = document.querySelector("#password-title");
const oldPwInput = document.querySelector("#old-pw");
const newPwInput = document.querySelector("#new-pw");

var user = firebase.auth().currentUser;

firebase.auth().onAuthStateChanged(function (user) {
  if (user) {
    localUsername = user.displayName;
  } else {
    // If not logged in redirect to loginpage
    window.location.replace("login.html");
  }
});

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
  usernameForm.reset();
}

usernameForm.addEventListener('submit', changeName);

// Reauthenticate before you can update to a new password
function reauth(pw) {
  var user = firebase.auth().currentUser;
  var cred = firebase.auth.EmailAuthProvider.credential(user.email, pw);
  return user.reauthenticateWithCredential(cred);
}

function changePassword(e) {
  e.preventDefault();
  var user = firebase.auth().currentUser;
  const oldPw = oldPwInput.value.trim();
  const newPw = newPwInput.value.trim();
  reauth(oldPw).then(() => {
    user.updatePassword(newPw).then(() => {
      console.log("PW updated!");
      passwordTitle.innerHTML = "Password changed!";

    }).catch((error) => {
      console.log("Fail!");
      passwordTitle.innerHTML = "Password too short!";
    });
  }).catch((error) => {
    console.log("Fail!");
    passwordTitle.innerHTML = "Wrong password";
  });
  passwordForm.reset();
}

passwordForm.addEventListener('submit', changePassword);