const usernameForm = document.querySelector("#username-form");
const passwordForm = document.querySelector("#password-form");
const inputField = document.querySelector("#name-input");
const usernameTitle = document.querySelector("#username-title");
const passwordTitle = document.querySelector("#password-title");
const deleteTitle = document.querySelector("#delete-title");
const oldPwInput = document.querySelector("#old-pw");
const oldPwDeleteInput = document.querySelector("#delete-input");
const deleteUserBtn = document.querySelector("#delete-btn");
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
    usernameTitle.innerHTML = "<span style='color:#2ac4aa'>Username changed to " + newUsername + "!</span>";
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
      passwordTitle.innerHTML = "<span style='color:#2ac4aa'>Password changed!</span>";

    }).catch((error) => {
      console.log("Fail!");
      passwordTitle.innerHTML = "<span style='color:#eccb62'>Password too short!</span>";
    });
  }).catch((error) => {
    console.log("Fail!");
    passwordTitle.innerHTML = "<span style='color:#ec6562'>Wrong password!</span>";
  });
  passwordForm.reset();
}

passwordForm.addEventListener('submit', changePassword);

function deleteUser(e) {
  e.preventDefault();
  var user = firebase.auth().currentUser;
  const pw = oldPwDeleteInput.value.trim();
  reauth(pw).then(() => {
    user.delete().then(() => {
      console.log("DELETE");
      deleteTitle.innerHTML = "<span style='color:#ec6562'>Deleting...</span>";

    }).catch((error) => {
      console.log("Something went wrong");
    });
  }).catch((error) => {
    console.log("Fail!");
    deleteTitle.innerHTML = "<span style='color:#ec6562'>Wrong password!</span>";
  });
}

deleteUserBtn.addEventListener('click', deleteUser);